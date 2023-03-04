import { doc, getDoc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { IFollowerProps } from "@/types/follower";
import { IUserPostProps } from "@/types/post";
export async function handleFollow(id: string = '', uid:string ='', followedByName:string=''): Promise<void> {
  try {
    const userRef = doc(db, 'users', id);
    const currentUserRef = doc(db, 'users', `${uid}`);

    const [getUsers] = await Promise.all([
      getDoc(userRef),
      getDoc(currentUserRef)
    ]);

    if (getUsers) {
      const res = Array(getUsers.data());
      const hasFollow: boolean = res[0]?.followers.some((follower: IFollowerProps) => follower.followedBy === uid);
      const follBtns = document.querySelectorAll(`[data-postid="${id}"]`)
      const updateAuthorFollowersLists = hasFollow
        ? {
          followers: arrayRemove({
            followedBy: uid,
            followedByName: followedByName
          })
        }
        : {
          followers: arrayUnion({
            followedBy: uid,
            followedByName: followedByName
          })
        };

      const updateCurrentUserFollowingLists = hasFollow ? {
        following: arrayRemove({ userId: id })}
        : { following: arrayUnion({ userId: id }) };

      await Promise.all([
        updateDoc(userRef, updateAuthorFollowersLists),
        updateDoc(currentUserRef, updateCurrentUserFollowingLists)
      ]).then(async () => {
        if (hasFollow) {
          follBtns.forEach(btn => btn.innerHTML = 'Follow')
        } else {
          follBtns.forEach(btn => btn.innerHTML = 'Following')
        }
      })
    }
  } catch (error:any) {
    console.log(error.message);
  }
};

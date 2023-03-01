import { doc, getDoc, arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { IFollowerProps } from "@/types/follower";
import { IUserPostProps } from "@/types/post";
import { getPosts } from "./getPosts";
export async function handleFollow(id: string = '', uid:string ='', followedByName:string=''): Promise<void> {
  try {
    const userPostContent = doc(db, 'users', id);
    const currentUserRef = doc(db, 'users', `${uid}`);

    const [getUsers] = await Promise.all([
      getDoc(userPostContent),
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
        updateDoc(userPostContent, updateAuthorFollowersLists),
        updateDoc(currentUserRef, updateCurrentUserFollowingLists)
      ]).then(async () => {
        await getPosts()
        if (hasFollow) {
          follBtns.forEach(btn => btn.innerHTML = 'Follow')
        } else {
          follBtns.forEach(btn => btn.innerHTML = 'Following')
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
};

export const hasFollowByUser = async (post:IUserPostProps, uid:string ='') => {
  const docRef = doc(db, 'users', `${post.postedById}`);
    const res = await getDoc(docRef)
    if (res) {
      const hasFollow: boolean = res.data()?.followers.some((follower: IFollowerProps) => follower.followedBy === uid);
      return hasFollow
    }
}
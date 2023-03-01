import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { db } from "../config/firebase"
import { IUserPostProps } from "@/types/post"

export async function savePost(post: IUserPostProps, uid: string = '', refetch:() => void) {
  try {
    const userRef = doc(db, "users", `${uid}`)
    const res = await getDoc(userRef)
    const user = [res.data()]
    const getSavedPosts = user?.map((user) => user?.savedPosts)
    const isAlreadySavedByUser = getSavedPosts[0]?.some((posts: { postId: string }) => posts.postId === post.postId)
    const btn = document.querySelector(`[data-postid='${post.postId}']`)
    console.log(btn);
    
    if (isAlreadySavedByUser) {
      await updateDoc(userRef, { savedPosts: arrayRemove(post) })
        .then(() => {
          btn?.classList.remove('text-red-500')
          console.log('You remove this post from your saved list')
          refetch()
        })
    } else {
      await updateDoc(userRef, { savedPosts: arrayUnion(post) })
        .then(() => {
          btn?.classList.add('text-red-500')
          console.log('You saved this post')
          refetch()
        })
    }
   
  } catch (error:any) {
    console.log(error.message);
  }
}
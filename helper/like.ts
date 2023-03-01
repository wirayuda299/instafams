import { doc, updateDoc, increment, arrayRemove, arrayUnion } from "firebase/firestore"
import { db } from "../config/firebase"
import { IUserPostProps } from "@/types/post"
import { getPosts } from "./getPosts"

export async function handleLikes(post:IUserPostProps, setDisabled:React.Dispatch<React.SetStateAction<boolean>>, uid:string=''): Promise<void> {
  setDisabled(true)
  try {
    const res = doc(db, 'posts', `post-${post.postId}`)
    if (post.likedBy.includes(uid)) {
      await updateDoc(res, {
        likes: increment(-1),
        likedBy: arrayRemove(uid)
      })
    } else {
      await updateDoc(res, {
        likes: increment(1),
        likedBy: arrayUnion(uid)
      })
    }

  } catch (error: any) {
    console.log(error.message);
  } finally {
    setDisabled(false)
    await getPosts()

  }
}
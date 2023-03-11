import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"
import { IUserPostProps } from "@/types/post"

export async function savePost(post: IUserPostProps, uid: string = '') {
  try {
    const userRef = query(collection(db, "users"), where("uid", "==", uid));
    const userSnap = await getDocs(userRef);
    const savedPosts = userSnap.docs[0].data().savedPosts;
    const hasSaved = savedPosts.find((post: { postId: number; }) => post.postId === post.postId)
    if(hasSaved) {
      await updateDoc(doc(db, 'users', `${uid}`), {
        savedPosts: arrayRemove(post.postId)
      })
    } else {
      await updateDoc(doc(db, 'users', `${uid}`), {
        savedPosts: arrayUnion(post.postId)
      })
    }
    
  } catch (error: any) {
    console.log(error.message);
  }
}
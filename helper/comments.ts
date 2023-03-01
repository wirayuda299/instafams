import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FormEvent } from "react";
import { db } from "../config/firebase";
import { IUserPostProps } from "@/types/post";
import { getPosts } from "./getPosts";

interface IProps {
  e: FormEvent<HTMLFormElement>,
  comment: string,
  post: IUserPostProps,
  setComment: React.Dispatch<React.SetStateAction<string>>,
}

export async function handleComment(e: FormEvent, comment: string, post: IUserPostProps, setComment: React.Dispatch<React.SetStateAction<string>>, uid:string='', name:string=''): Promise<void> {
  e.preventDefault()
  if (comment === '') return
  try {
    const postRef = doc(db, 'posts', `post-${post.postId}`);
    await updateDoc(postRef, {
      comments: arrayUnion({
        commentByUid: uid,
        comment: comment,
        commentByName: name
      })
    }).then(async () => {
      console.log('success')
      setComment('')
      await getPosts()
    });
  } catch (error) {
    console.log(error);
  }
}
import { handleLikes } from "@/helper/like";
import { savePost } from "@/helper/savePost";
import { IUserPostProps } from "@/types/post";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiBookmark, BiBookmarkHeart } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from "@/config/firebase";

interface IProps {
  post: IUserPostProps
  disabled: boolean
  uid: string
  setCommentOpen: Dispatch<SetStateAction<boolean>>
  commentOpen: boolean
}

export const PostActions: FC<IProps> = ({ post, disabled, setCommentOpen, uid, commentOpen }) => {
  const [likes, setLikes] = useState<any[]>(post.likedBy)
  const [savedPosts, setSavedPosts] = useState<any[]>([])

  useEffect(() => {
    onSnapshot(doc(db, 'posts', `post-${post.postId}`), (doc) => {
      if (doc.exists()) {
        setLikes(doc.data().likedBy)
      }
    })
  }, [post.postId])

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${uid}`), (doc) => {
      if (doc.exists()) {
        console.log(doc.data().savedPosts)
        setSavedPosts(doc.data().savedPosts)
      }
    })
  }, [post])



  return (
    <div className="flex items-center justify-between mt-3 mb-2 p-1">
      <div className="flex gap-x-5">
        <button
          data-postid={post.postId}
          onClick={() => handleLikes(post, uid)}>
          {likes.includes(uid)
            ? <AiFillHeart className="text-3xl text-red-600" /> : <AiOutlineHeart className="text-3xl" />
          }
        </button>
        <button onClick={() => setCommentOpen(!commentOpen)}>
          <FaRegComment className="text-3xl" />
        </button>
      </div>
      <div className="flex">
        <button className='saveBtn' data-saveid={post.postId} onClick={() => savePost(post, uid)} >
          {savedPosts.map(post => post.postId).includes(post.postId) ? (
            <BiBookmarkHeart className="text-3xl" />
          ) : (
            <BiBookmark className="text-3xl" />
          )}
        </button>
      </div>
    </div>
  )
};

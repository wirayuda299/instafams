import { handleLikes } from "@/helper/like";
import { savePost } from "@/helper/savePost";
import { IUserPostProps } from "@/types/post";
import {  FC, useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {  FaRegComment } from "react-icons/fa";
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from "@/config/firebase";
import { CommentsToggler } from "@/store/CommentsToggler";
import { useRecoilState } from "recoil";
import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";
interface IProps {
  post: IUserPostProps
  uid: string
}

export const PostActions: FC<IProps> = ({ post, uid }) => {
  const [likes, setLikes] = useState<any[]>([])
  const [savedPosts, setSavedPosts] = useState<any[]>([])
  const [commentOpen , setCommentOpen] = useRecoilState(CommentsToggler)

  useEffect(() => {
    onSnapshot(doc(db, 'posts', `post-${post.postId}`), async (doc) => {
      if (doc.exists()) {
        await setLikes(doc.data().likedBy)
      }
    })
  }, [post.postId])

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${uid}`), (doc) => {
      if (doc.exists()) {
        setSavedPosts(doc.data().savedPosts)
      }
    })
  }, [post.postId])

  return (
    <div className="flex items-center justify-between mt-3 mb-2 p-1">
      <div className="flex gap-x-5">
        <button
          onClick={() => handleLikes(post, uid) }
          data-postid={post.postId}
          className='transition-all ease duration-500'
          >
          {likes.includes(uid)
            ?
            <AiFillHeart className="text-3xl text-red-600 " />
            :
            <AiOutlineHeart className="text-3xl" />

          }
        </button>
        <button onClick={() => setCommentOpen(!commentOpen)}>
          <FaRegComment className="text-3xl" />
        </button>
      </div>
      <div className="flex">
        <button className='saveBtn' data-saveid={post.postId} onClick={() => savePost(post, uid)} >
          {savedPosts.includes(post.postId) ? (
            <RiBookmarkFill className="text-3xl" />
          ) : (
            <RiBookmarkLine className="text-3xl" />
          )}
        </button>
      </div>
    </div>
  )
};

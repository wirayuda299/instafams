import { db } from "@/config/firebase";
import { handleComment } from "@/helper/comments";
import { IUserPostProps } from "@/types/post";
import { onSnapshot, doc } from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useRecoilState } from 'recoil';
import { CommentsToggler } from "@/store/CommentsToggler";

interface IProps {
  post: IUserPostProps
  comment: string
  setComment: Dispatch<SetStateAction<string>>
  uid: string
  username: string
 }

export const PostComment: FC<IProps> = ({post, comment, setComment, uid,username}) => {
  const [currentComments , setCurrentComments] = useState<any[]>(post.comments)
  const [commentOpen , setCommentOpen] = useState(false)
  useEffect(() => {
    onSnapshot(doc(db, 'posts', `post-${post.postId}`), (doc) => {
      if(doc.exists()) {
        setCurrentComments(doc.data().comments)
      }
    })
  }, [post.postId])
  return (
    <div>
       <form
          className='py-1 px-1'
          onSubmit={(e) => handleComment(e, comment, post, setComment, uid, username)}>
          <input
            type="text"
            placeholder='Add a comment'
            value={comment}
            className='focus:outline-none bg-transparent text-xs'
            onChange={e => setComment(e.target.value)}
          />
        </form>
    <div className={`p-1 pb-2 ${commentOpen ? 'block' : 'hidden'}`}>
      {post.comments.length < 1 ? (
        <p className='text-xs text-center'>No comments yet</p>
      ) : (
        currentComments.map((comment, i) => (
          <div className='flex space-x-2 items-center' key={comment.comment}>
            <h5 className='font-semibold text-sm'>{comment.commentByName}</h5>
            <p className='text-xs font-normal'>{comment.comment}</p>
          </div>
        )
        ))}
    </div>
    </div>
  )
};

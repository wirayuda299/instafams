'use client'
import { doc, getDoc } from 'firebase/firestore'
import { debounce } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { db } from '@/config/firebase'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaRegComment } from 'react-icons/fa'
import { BiBookmark } from 'react-icons/bi'
import { BsFillBookmarkFill, BsThreeDots } from 'react-icons/bs'
import { IUserPostProps } from '@/types/post'
import { handleFollow } from '@/helper/follow'
import { savePost } from '@/helper/savePost'
import { handleComment } from '@/helper/comments'
import { handleLikes } from '@/helper/like'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

export interface ICommentsProps {
  comment: string
  commentByName: string
  commentByUid: string
}
export interface IPostCardProps {
  post: IUserPostProps 
  refetch: () => void
}

export const PostCard: FC<IPostCardProps> = ({ post, refetch}) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const [commentOpen, setCommentOpen] = useState<boolean>(false)
  const { data: session } = useSession()

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg dark:bg-black dark:border-black dark:text-white rounded-sm overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <Image
            className="h-8 w-8 rounded-full"
            alt={post?.author ?? 'user profile'}
            width={32}
            height={32}
            priority={true}
            src={post?.postedByPhotoUrl || ''}
          />
          <div className="ml-3 flex-1">
            <span className="text-sm font-semibold antialiased block leading-tight">{post?.author}</span>
          </div>
          {session?.user.uid !== post.postedById ? (
            <button onClick={() => handleFollow(post.postedById, session?.user.uid, session?.user.username, refetch)} className="follBtn text-xs  antialiased block leading-tight" data-postid={post.postedById}>
              Follow
            </button>
          ) : null}
          {session?.user.uid === post.postedById ? (
            <button className="text-sm font-semibold antialiased block leading-tight">
              <BsThreeDots className="text-2xl" />
            </button>
          ) : null}
        </div>
        <Image
          className="w-full"
          src={post.image}
          width={640}
          placeholder="blur"
          blurDataURL={'blur'}
          priority={true}
          height={640}
          quality={80}
          alt={post?.author ?? 'user post image'}
        />

        <div className="flex items-center justify-between mt-3 mb-2 p-1">
          <div className="flex gap-x-5">
            <button
              disabled={disabled}
              onClick={() => handleLikes(post, setDisabled, session?.user?.uid, refetch)}>
              {post.likedBy.includes(session?.user.uid ?? '')
                ? <AiFillHeart className="text-3xl text-red-600" /> : <AiOutlineHeart className="text-3xl" />
              }
            </button>
            <button onClick={() => setCommentOpen(!commentOpen)}>
              <FaRegComment className="text-3xl" />
            </button>
          </div>
          <div className="flex">
            <button className='saveBtn' data-saveid={post.postId} onClick={() => savePost(post, session?.user?.uid, refetch)} >
              <BiBookmark className="text-3xl" />
            </button>
          </div>
        </div>
        <div className={`font-semibold text-xs px-1 mt-1 mb-4 ${post.likes < 1 ? 'hidden' : 'block'}`}>{post.likes} likes</div>
        <div className='flex items-center gap-2 px-1'>
          <h5 className='font-semibold text-md'>{post?.author}</h5>
          <p className='text-sm font-thin'>{post.captions}</p>
          <div>{post.hashtags.map((hastag, i) => (
            <span key={i} className='text-xs font-normal text-blue-500'>{hastag}</span>
          ))}
          </div>
        </div>
        <form
          className='py-1 px-1'
          onSubmit={(e) => handleComment(e, comment, post, setComment, session?.user.uid, session?.user.username, refetch)}>
          <input
            type="text"
            placeholder='Add a comment'
            value={comment}
            className='focus:outline-none bg-transparent text-xs'
            onChange={e => setComment(e.target.value)}
          />
        </form>
        <div className={`p-1 ${commentOpen ? 'block' : 'hidden'}`}>
          {post.comments.length < 1 ? (
            <p className='text-xs text-center'>No comments yet</p>
          ) : (
            post.comments.map((comment, i) => (
              <div className='flex space-x-2 items-center' key={i}>
                <h5 className='font-semibold text-sm'>{comment.commentByName}</h5>
                <p className='text-xs font-normal'>{comment.comment}</p>
              </div>
            )
            ))}
        </div>
      </div>
    </div>
  )
}
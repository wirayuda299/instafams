'use client'
import { FC, useEffect, useState } from 'react'
import { IUserPostProps } from '@/types/post'
import Image from 'next/image'
import { PostActions } from './ActionButton'
import { PostHeader } from './Header'
import { PostAuthor } from './Author'
import { PostComment } from './Comments'
import { db } from '@/config/firebase';
import { doc, onSnapshot } from 'firebase/firestore'


export interface ICommentsProps {
  comment: string
  commentByName: string
  commentByUid: string
}
export interface IPostCardProps {
  post: IUserPostProps
  followingLists: { userId: string }[]
  uid: string
  username: string
}

export const PostCard: FC<IPostCardProps> = ({ post, followingLists, uid, username }) => {
  const [comment, setComment] = useState<string>('')
  const [likesCount, setLikesCount] = useState<number>(0)

  useEffect(() => {
    onSnapshot(doc(db, "posts", `post-${post.postId}`), (doc) => {
      if (doc.exists()) {
        setLikesCount(doc.data().likedBy.length)
      }
    });
  }, [post.postId])

  return (
    <div className="w-full relative my-2">
      <div className="bg-white shadow-lg  dark:bg-black dark:border-black dark:text-white rounded-sm overflow-hidden">
        <PostHeader
          currentuserUid={uid}
          followingLists={followingLists}
          post={post}
          username={username}
        />
        <div className='relative h-full w-full mx-auto'>
          <Image
            className="w-full"
            src={post.image}
            width={500}
            placeholder="blur"
            blurDataURL={'blur'}
            priority={true}
            loading="eager"
            decoding='async'
            loader={({ src }) => src}
            height={500}
            quality={70}
            alt={post?.author ?? 'user post image'}
          />
        </div>

        <PostActions
          post={post}
          uid={uid}
        />
        <p className={`font-light text-xs px-1 mt-1 mb-4 ${likesCount < 1 ? 'hidden' : 'block'}`}>
          <span>
            {likesCount} likes
          </span>
        </p>
        <PostAuthor post={post} />
        <PostComment
          post={post}
          comment={comment}
          setComment={setComment}
          uid={uid}
          username={username} />
      </div>
    </div>
  )
}
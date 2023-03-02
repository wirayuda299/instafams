import { FC } from "react"
import Image from "next/image"
import { handleFollow } from "@/helper/follow"
import { BsThreeDots } from "react-icons/bs"
import { IUserPostProps } from '@/types/post';

interface IProps {
  currentuserUid: string
  post: IUserPostProps
  followingLists: { userId: string }[]
  username: string
}

export const PostHeader: FC<IProps> = ({ post, currentuserUid, followingLists, username }) => {
  return (
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
      {currentuserUid !== post.postedById ? (
        <button onClick={() => handleFollow(post.postedById, currentuserUid, username)} className="follBtn text-xs  antialiased block leading-tight" data-postid={post.postedById}>
          {followingLists?.map((user) => user.userId).includes(post.postedById) ? 'Following' : 'Follow'}
        </button>
      ) : null}
      {currentuserUid === post.postedById ? (
        <button className="text-sm font-semibold antialiased block leading-tight">
          <BsThreeDots className="text-2xl" />
        </button>
      ) : null}
    </div>
  )
};

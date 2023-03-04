
import { FC, useEffect, useState } from "react"
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
  const [createdDate, setCreatedDate] = useState<string>('')
  useEffect(() => {
    const now = Date.now();
    const diff = now - Number(post.createdAt) ;

    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    let diffString;
    if (diffSeconds < 60) {
      diffString = 'now';
    } else if (diffMinutes < 60) {
      diffString = `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      diffString = `${diffHours} hours ago`;
    } else {
      diffString = `${diffDays} ${diffDays < 2 ? 'day' : 'days'} ago`;
    }
    setCreatedDate(diffString)

  }, [])
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
        <span className="text-sm font-semibold antialiased block leading-tight">
          {post?.author}
          </span>
        <span className="text-xs font-thin antialiased block leading-tight">
          {createdDate}
          </span>
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

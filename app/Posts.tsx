'use client'

import { PostCard } from "@/components/Card/Post/Post"
import { db } from "@/config/firebase"
import { IUserPostProps } from "@/types/post"
import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

interface IPostsProps {
  username: string
  uid: string
  followinglists: { userId: string }[]
}

export default function Posts({ username,uid, followinglists}: IPostsProps) {
  const [posts, setPosts] = useState<IUserPostProps[]>([])
  useEffect(() => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      const posts: IUserPostProps[] = []
      snapshot.forEach((doc) => {
        const data = doc.data() as IUserPostProps
        posts.push({ ...data, docId: doc.id })
      })
      setPosts(posts)
    })
  }, [db])
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          post={post}
          username={username}
          followingLists={followinglists}
          uid={uid}
        />
      ))}
    </div>
  )
}
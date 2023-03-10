'use client'
import { PostCard } from "@/components/Card/Post/Post"
import { db } from "@/config/firebase"
import { IUserPostProps } from "@/types/post"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState, Suspense } from "react"
import Loader from '@/components/Loader/Loader'

interface IPostsProps {
  username: string
  uid: string
  followinglists: { userId: string }[]
}

export default function Posts({ username, uid, followinglists }: IPostsProps) {
  const [posts, setPosts] = useState<IUserPostProps[]>([])
  useEffect(() => {
    onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc")), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => doc.data() as IUserPostProps))
    })
  }, [db])
  return (
    <>
      {
        posts.map((post) => (
          <Suspense fallback={<Loader />} key={post?.postId}>
            <PostCard
              post={post}
              username={username}
              followingLists={followinglists}
              uid={uid}
            />
          </Suspense>
        ))
      }</>
  )
}

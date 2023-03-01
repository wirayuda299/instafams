'use client'
import { getPosts } from "@/helper/getPosts"
import { useQueries, useQuery } from "react-query"
import Loader from "../Loader"
import { PostCard } from "./Post"
import { db } from '@/config/firebase'
import { collection, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useSession } from "next-auth/react"
import { useEffect } from "react"

async function HasFollowByUser(uid: string = '') {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid))
    const res = await getDocs(q)
    return res.docs[0].data()
  } catch (error: any) {
    console.log(error.message);

  }
}

export default function Userposts() {
  const { data: session } = useSession()
  const { data, isLoading, refetch } = useQuery('posts', getPosts)

  useEffect(() => {
    try {
      const hasFollowByUser = async () => {
        const authorId = data?.map((post) => post.postedById)
        const user = await getUserByUid(session?.user.uid)
        const followinglists = user && user[0].data().following
        followinglists.forEach((user: { userId: string }) => {
          if (authorId?.includes(user.userId)) {
            const follBtns = document.querySelectorAll(`[data-postid="${user.userId}"]`)
            console.log("User with uid " + user.userId + " is in authorid array");
            follBtns.forEach(btn => btn.innerHTML = 'Following')
          } else {
            const follBtns = document.querySelectorAll(`[data-postid="${user.userId}"]`)
            console.log("User with uid " + user.userId + " is not in authorid array");
            follBtns.forEach(btn =>  btn.innerHTML = 'Follow')
          }
        });
      }
      hasFollowByUser()

    } catch (error: any) {
      console.log(error.message);
    }
  }, [data])

  return (
    <div className="w-full h-full p-5">
      {isLoading ? (
        [...Array(10)].map((data, i) => (
          <Loader key={i} />
        ))) : (
        data?.map((post) => (
          <PostCard post={post} key={post.docId} refetch={refetch} />
        ))
      )}
    </div>
  )
}

async function getUserByUid(uid: string = '') {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid))
    const res = await getDocs(q)
    return res.docs

  } catch (error: any) {
    console.log(error.message);
  }
}
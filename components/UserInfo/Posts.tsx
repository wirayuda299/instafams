'use client'

import { db } from "@/config/firebase"
import { IUserPostProps } from "@/types/post"
import { onSnapshot, query, collection, orderBy, where, DocumentData } from "firebase/firestore"
import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { AiFillHeart, AiTwotoneMessage } from "react-icons/ai"
import { useRecoilState } from "recoil"
import { tabPosts } from "@/store/TabToggler"

export default function Posts({ uid }: { uid: string }) {
  const [posts, setPosts] = useState<DocumentData[]>([])
  const [tabposts, setTabPosts] = useRecoilState(tabPosts)
  useEffect(() => {
    onSnapshot(query(collection(db, "posts"), where('postedById', '==', `${uid}`)), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => doc.data()))
    })
  }, [db])

  return (
    <>
      {tabposts && (
        <div className='grid grid-cols-1 sm:gris-cols-2 md:grid-cols-3 gap-5 p-5 justify-center items-center w-full '>
          {posts?.map((post: any) => (
            <Suspense fallback={<h1>loading user posts</h1>} key={post?.postId}>
              <div className='relative w-full group'>
                <Image
                  src={post?.image}
                  alt={post?.captionsn ?? ' post image'}
                  width={500}
                  height={500}
                  className='rounded-md object-cover w-full'
                  loading="lazy"
                  quality={65}
                />
                <div className="absolute inset-0 flex justify-around items-center bg-white bg-opacity-0 hover:bg-opacity-25">
                  <button className="opacity-0 group-hover:opacity-100 transition-all ease duration-500 text-center text-white">
                    <span className='text-center'>
                      <AiFillHeart size={35} color={'white'} />
                      <small className='font-semibold'> {post?.likedBy.length} likes </small>
                    </span>
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-all ease duration-500 text-center text-white">
                    <span>
                      <AiTwotoneMessage size={35} color={'white'} />
                      <small className='font-semibold'> {post?.comments.length} comments </small>
                    </span>
                  </button>
                </div>
              </div>
            </Suspense>
          ))}
        </div>
      )}
    </>
  )
}

'use client'
import { db } from "@/config/firebase"
import { onSnapshot, query, collection, where, DocumentData, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Image from "next/image"
import { AiFillHeart, AiTwotoneMessage } from "react-icons/ai"
import { tabSavedPosts } from "@/store/TabToggler"
import { useRecoilState } from "recoil"

export default function SavedPosts({ uid }: { uid: string }) {
  const [savedPosts, setSavedPosts] = useState<DocumentData[]>([])
  const [savedPostsTab, setSavedPostsTab] = useRecoilState(tabSavedPosts)

  useEffect(() => {
    onSnapshot(query(collection(db, "users"), where('uid', '==', `${uid}`)), snapshot => {
      const userSavedPosts = snapshot.docs.map((doc) => doc.data().savedPosts)
      userSavedPosts.forEach(postId => {
        onSnapshot(doc(db, 'posts', `post-${postId}`), snapshot => {
          if (snapshot.exists()) {
            setSavedPosts([snapshot.data()])
          }
        })
      })
    })
  }, [db])



  return (
    <>
      {
        savedPostsTab && (
          <div className='grid grid-cols-1 sm:gris-cols-2 md:grid-cols-3 gap-5 p-5 justify-center items-center w-full '>
            {savedPosts?.map((post: any, i: number) => (
              <div key={post} className='relative w-full group'>
                <Image
                  src={post?.image}
                  alt={post?.captions ?? ' post image'}
                  width={500}
                  height={500}
                  className='rounded-md object-cover w-full'
                  loading="lazy"
                  quality={65}
                />
                <div className="absolute inset-0 flex justify-around items-center bg-black bg-opacity-0 hover:bg-opacity-25">
                  <button className="opacity-0 group-hover:opacity-100 transition-all ease duration-500 text-center text-white">
                    <p className='text-center flex items-center space-x-2'>
                      <AiFillHeart size={35} color={'white'} />
                      <small className='font-semibold text-sm'> {post?.likedBy.length}</small>
                    </p>
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-all ease duration-500 text-center text-white">
                    <p className='text-center flex items-center space-x-2'>
                      <AiTwotoneMessage size={35} color={'white'} />
                      <small className='font-semibold text-sm'> {post?.comments.length} </small>
                    </p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </>
  )
}

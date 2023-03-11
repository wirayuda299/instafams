'use client'
import { db } from "@/config/firebase"
import { onSnapshot, query, collection, where, DocumentData } from "firebase/firestore"
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
          {posts?.map((post: any, i:number) => (
            <Suspense fallback={<h1>loading user posts</h1>} key={post}>
              <div className='relative w-full group'>
                <Image
                  src={post?.image}
                  alt={post?.captionsn ?? ' post image'}
                  width={500}
                  height={500}
                  className='rounded-md object-cover w-full'
                  priority
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
            </Suspense>
          ))}
        </div>
      )}
    </>
  )
}

'use client'
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { getDocs, query, collection } from "firebase/firestore"
import { db } from '@/config/firebase'
import { useQuery } from "react-query";
import { getUser } from "@/helper/getUser";

export default function Suggestions() {
  const { data: session } = useSession()
  const { data, isError } = useQuery('users',() => getUser(session?.user?.uid))

  if (isError) {
    return <div>Something went wrong</div>
  }

  return (
    <div className='w-full h-full p-5 max-w-sm'>
      <div className='flex items-center space-x-2 mb-2 justify-around md:justify-between'>
        <div className='flex items-center space-x-3 mb-2'>
          <Image
            className='w-10 h-10 rounded-full'
            src={session?.user?.image ?? ''}
            alt={session?.user?.name ?? ''}
            width={100}
            height={100}
          />
          <span className='text-black dark:text-white text-base font-semibold'>
            {session?.user?.name}
          </span>
        </div>
        <div>
          <button className='text-blue-600 text-xs font-semibold'>
            Switch
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <p className='text-gray-500 text-sm font-semibold'>Suggestion for you</p>
        <button className="text-xs dark:text-blue-600 ">
          See All
        </button>
      </div>
      <div>
        {data?.map((user) => (
          <div key={user.uid} className='flex items-center space-x-2 mb-2 mt-5 w-full justify-between'>
            <div className="flex space-x-2 items-center pb-3">
              <Image
                className='w-10 h-10 rounded-full'
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
              />
              <div className='flex flex-col items-start justify-center'>
                <span className='text-black dark:text-white text-sm font-semibold'>{user.username}</span>
                <p className=' text-xs text-slate-500'>followed by</p>
              </div>
            </div>
            <div className='ml-auto'>
              <button className='text-blue-600 font-light text-xs'>Follow</button>
            </div>
          </div>
        )
        )}
      </div>
    </div>

  )
}

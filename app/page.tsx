import { PostCard } from '@/components/Post'
import Loader from '@/components/Loader'
import Suggestions from './Suggestion'
import { getPosts } from '@/helper/getPosts'
import { getServerSession } from 'next-auth'
import { JWT } from "next-auth/jwt";
import { db } from '@/config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Image from 'next/image'
import { getUser, getUserByUid } from '@/helper/getUser';

export default async function Home() {
  const posts = await getPosts()
  const session = await getServerSession({
    callbacks: {
      async session({ session, token }: { session: any, token: JWT }) {
        if (session && session.user) {
          session.user.username = session.user?.name.split(' ').join('').toLocaleLowerCase();
          session.user.uid = token.sub;
        }
        return session;
      }
    }
  })
  const currentUser = await getUserByUid(session?.user.uid)
  const followinglists = currentUser && currentUser[0].data().following
  const users = await getUser(session.user.uid)

  return (
    <section className='w-full h-full md:p-3 max-w-7xl'>
      <div className='w-full flex justify-between items-start first:flex-grow'>
        <div className="w-full h-full flex flex-col p-5">
          {posts?.length === 0 && (
            [1,2,3,4,5].map((data, i) => (
              <Loader key={i} />
            )
          ))}
          {posts?.map((post) => (
            <PostCard post={post} key={post.docId} followingLists={followinglists} />
          ))}
        </div>
        <section className='min-w-[400px] hidden lg:block'>
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
        {users?.map((user) => (
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
        ))}
      </div>
    </div>
        </section>
      </div>
    </section>
  )
}


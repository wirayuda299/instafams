import { getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Image from "next/image";
import { getCurrentUserData } from '@/helper/getUser'
import { IUserPostProps } from "@/types/post";
import { BsGrid3X3Gap, BsBookmark, BsPersonSquare } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart,AiTwotoneMessage } from "react-icons/ai";
import {TbMessageCircle2} from 'react-icons/tb'

interface IUser {
    image: string,
    createdAt: string,
    following: {
        userId: string,
    }[],
    followers: {
        userId: string,
    }[],
    email: string,
    savedPosts: IUserPostProps[],
    uid: string,
    posts: IUserPostProps[],
    username: string
}

export default async function Profile() {
    const session = await getServerSession({
        callbacks: {
            async session({ session, token }: { session: any; token: JWT }) {
                if (session && session.user) {
                    session.user.username = session.user?.name
                        .split(' ')
                        .join('')
                        .toLocaleLowerCase();
                    session.user.uid = token.sub;
                }
                return session;
            },
        },
    })
    const getuser = await getCurrentUserData(session.user.uid)
    const user = getuser?.map((user) => user.data()) as IUser[]
    return (
        <section className='w-full py-5'>
            <div className="text-black dark:text-white border-b pb-5 container">
                <div className="flex items-center w-full space-x-5 gap-5 justify-evenly md:justify-center md:space-x-10">
                    <Image
                        src={session?.user.image ?? ''}
                        alt={session?.user.name ?? ''}
                        width={250}
                        height={250}
                        className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border p-1 border-pink-500"
                    />
                    <div>
                        <h1 className="text-2xl font-bold sm:hidden">{session?.user.username}</h1>
                        <div className='text-black'>
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl sm:text-3xl font-bold sm:px-5 hidden sm:block pb-3">{session?.user.username}</h1>
                                <button className='bg-gray-100 flex-1 rounded-md px-5 py-2 text-sm'>
                                    Edit profile
                                </button>
                            </div>
                            <ul className=" justify-evenly sm:flex hidden sm:px-5 items-center space-x-3 mt-5">
                                <li className="text-sm text-center font-medium mt-2">
                                    <div className='flex space-x-2 items-center'>
                                        <span className='font-thin'>{user[0]?.posts.length}</span>
                                        <span>Posts</span>
                                    </div>
                                </li>
                                <li className="text-sm text-center font-medium text-nowrap flex mt-2">
                                    <div className='flex space-x-2 items-center'>
                                        <span className='font-thin'>{user[0]?.followers.length}</span>
                                        <span>Followers</span>
                                    </div>
                                </li>
                                <li className="text-sm text-center font-medium text-nowrap flex mt-2">
                                    <div className='flex space-x-2 items-center'>
                                        <span className='font-thin'>{user[0]?.following.length}</span>
                                        <span>Following</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <ul className="border-t justify-evenly flex sm:hidden sm:px-5 items-center space-x-3 mt-5">
                    <li className="text-sm  text-center font-semibold mt-2">
                        <div >
                            <p className='font-normal '>{user[0]?.posts.length}</p>
                            <p>Posts</p>
                        </div>
                    </li>
                    <li className="text-sm text-center font-semibold text-nowrap flex mt-2">
                        <div >
                            <p className='font-normal'>{user[0]?.followers.length}</p>
                            <p>Followers</p>
                        </div>
                    </li>
                    <li className="text-sm  text-center font-semibold text-nowrap flex mt-2">
                        <div>
                            <p className='font-normal'>{user[0]?.following.length}</p>
                            <p>Following</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div className='mx-auto max-w-2xl border-b'>
                <div className='flex justify-around py-3 items-center w-full gap-x-5 pb-5'>
                    <button>
                        <span>
                            <BsGrid3X3Gap size={25} />
                        </span>
                    </button>
                    <button>
                        <span>
                            <BsBookmark size={25} />
                        </span>
                    </button>
                    <button>
                        <span>
                            <BsPersonSquare size={25} />
                        </span>
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 sm:gris-cols-2 md:grid-cols-3 gap-5 p-5 justify-center items-center w-full '>
                {user[0].posts.map(post => (
                    console.log(post),
                    <div key={post.postId} className='relative w-full group'>
                        <Image
                            src={post.image}
                            alt={post.captions}
                            width={500}
                            height={500}
                            className='rounded-md object-cover w-full'
                            loading="lazy"
                            quality={65}
                        />
                        <div className="absolute inset-0 flex justify-around items-center bg-white bg-opacity-0 hover:bg-opacity-25">
                           <button className="opacity-0 group-hover:opacity-100 transition-all ease duration-500">
                                 <span>
                                    <AiFillHeart size={30} color={'white'} />
                                    <small> {post.likedBy.length} likes </small>
                                </span>
                                
                           </button>
                           <button  className="opacity-0 group-hover:opacity-100 transition-all ease duration-500">
                                 <span>
                                    <AiTwotoneMessage size={30} color={'white'} />
                                    <small> {post.comments.length} comments </small>
                                </span>
                                
                           </button>
                        </div>
                    </div>
                ))}
                

            </div>
        </section >
    )
}
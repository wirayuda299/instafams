import { getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Image from "next/image";
import { getCurrentUserData } from '@/helper/getUser'
import { IUserPostProps } from "@/types/post";
import Posts from "@/components/UserInfo/Posts";
import Statistic from "@/components/UserInfo/Statistic";
import Tab from "@/components/UserInfo/Tab";
import SavedPosts from "@/components/UserInfo/SavedPosts";
import { Metadata } from "next";

export interface IUser {
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
    username: string
}
export async function generateMetadata({ params }: {params: {id: string}}): Promise<Metadata> {
    const getuser = await getCurrentUserData(params.id)
    const user = getuser?.map((user) => user.data()) as IUser[]
    return { 
        title: `${user[0]?.username} | Instafams`,
        description: `View ${user[0]?.username}'s profile on instafams.`,

     }
  }

export default async function Profile({params}: {params: {id: string}}) {
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
 
    const getuser = await getCurrentUserData(params.id)
    const user = getuser?.map((user) => user.data()) as IUser[]

    return (
     <>
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
                    <Statistic
                        username={session.user.username}
                        uid={session.user.uid}
                    />
                </div>
            </div>
            <Tab />
            <Posts uid={session.user.uid} />
            <SavedPosts uid={session.user.uid}/>
        </section>
     </>
    )
}
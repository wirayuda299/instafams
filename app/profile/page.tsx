import { getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Image from "next/image";
import { getCurrentUserData } from '@/helper/getUser'
import { IUserPostProps } from "@/types/post";
import { BsGrid3X3Gap, BsBookmark, BsPersonSquare } from "react-icons/bs";
import Posts from "@/components/UserInfo/Posts";
import Statistic from "@/components/UserInfo/Statistic";
import Tab from "@/components/UserInfo/Tab";
import SavedPosts from "@/components/UserInfo/SavedPosts";

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
                    <Statistic
                        username={session.user.username}
                        posts={user[0].posts}
                        followers={user[0].followers}
                        following={user[0].following}
                    />
                </div>
            </div>
            <Tab />
            <Posts uid={session.user.uid} />
            <SavedPosts uid={session.user.uid}/>
        </section>
    )
}
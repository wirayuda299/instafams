import { getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Image from "next/image";
import { getCurrentUserData } from '@/helper/getUser'
import { IUserPostProps } from "@/types/post";

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
    console.log(user)
    return (
        <section className='w-full py-5'>
            <div className=" text-black dark:text-white flex px-5 space-x-3">
                <Image
                    src={session?.user.image ?? ''}
                    alt={session?.user.name ?? ''}
                    width={300}
                    height={300}
                    className="w-36 h-36 rounded-full border p-1"
                />
                <div>
                    <h1 className="text-2xl font-bold mt-5">{session?.user.username}</h1>
                    <div className="flex justify-evenly items-center space-x-3">
                        <p className="text-sm sm:font-semibold text-nowrap flex mt-2">
                            <span> {user[0]?.posts.length} Posts</span>
                        </p>
                        <p className="text-sm sm:font-semibold text-nowrap mt-2">{user[0]?.followers.length} Followers</p>
                        <p className="text-sm sm:font-semibold text-nowrap mt-2">{user[0]?.following.length} Following</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
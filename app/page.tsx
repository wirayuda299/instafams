import { PostCard } from '@/components/Card/Post/Post';
import { getServerSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Image from 'next/image';
import { getUserRecommendation, getCurrentUserData } from '@/helper/getUser';
import { getPosts } from '@/helper/getPosts';
import Loader from '@/components/Loader/Loader';
import { Suspense } from 'react';

export default async function Home() {
	const getposts = await getPosts()
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
	});
	const currentUser = await getCurrentUserData(session?.user.uid);
	const usersRecommendations = await getUserRecommendation(session.user.uid);
	const followinglists = currentUser && currentUser[0].data().following;
	const [posts, sessions, usersLists] = await Promise.all([getposts, session, usersRecommendations]);
	const filteredUsers = usersLists?.filter(user => {
		const isFollowing = followinglists.some((following:{userId:string}) => following.userId === user.uid);
		return !isFollowing;
	});
	return (
		<section className='w-full h-full md:p-3 max-w-7xl'>
			<div className='w-full flex justify-between items-start first:flex-grow'>
				<div className='w-full h-full flex flex-col p-5'>
					{posts?.map((post) => (
						<Suspense fallback={<Loader/>} key={post.docId}>
							<PostCard
								post={post}
								username={sessions.user.username}
								followingLists={followinglists}
								uid={sessions.user.uid}
							/>
						</Suspense>
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
						<div className='flex justify-between'>
							<p className='text-gray-500 text-sm font-semibold'>
								Suggestion for you
							</p>
							<button className='text-xs dark:text-blue-600 '>See All</button>
						</div>
						<div>
							{filteredUsers?.map((user) => (
								<div
									key={user.uid}
									className='flex items-center space-x-2 mb-2 mt-5 w-full justify-between'
								>
									<div className='flex space-x-2 items-center pb-3'>
										<Image
											className='w-10 h-10 rounded-full'
											src={user.image}
											alt={user.name}
											width={100}
											height={100}
										/>
										<div className='flex flex-col items-start justify-center'>
											<span className='text-black dark:text-white text-sm font-semibold'>
												{user.username}
											</span>
											<p className=' text-xs text-slate-500'>followed by</p>
										</div>
									</div>
									<div className='ml-auto'>
										<button className='text-blue-600 font-light text-xs' data-postid={user.uid}>
											Follow
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</section>
	);
}

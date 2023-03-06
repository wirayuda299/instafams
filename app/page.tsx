import { PostCard } from '@/components/Card/Post/Post';
import { getServerSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { getUserRecommendation, getCurrentUserData } from '@/helper/getUser';
import { getPosts } from '@/helper/getPosts';
import Loader from '@/components/Loader/Loader';
import { Suspense } from 'react';
import Suggestions from '@/components/Suggestions/Suggestions';
import { IUserPostProps } from '@/types/post';
import Posts from './Posts';

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
	const filteredUsers = usersLists?.filter((user) => {
		const isFollowing = followinglists.some((following: { userId: string }) => following.userId === user.uid);
		return !isFollowing;
	});

	return (
		<section className='w-full h-full md:p-3 max-w-7xl'>
			<div className='w-full flex justify-between items-start first:flex-grow'>
				<div className='w-full h-full flex flex-col p-5'>
					<Suspense fallback={<Loader />} >
						<Posts
							followinglists={followinglists}
							uid={session.user.uid}
							username={session.user.username}
						/>
					</Suspense>

				</div>
				<Suspense fallback={<p>Loading user....</p>}>
					<Suggestions
						image={sessions?.user.image}
						username={sessions?.user.username}
						users={filteredUsers}
					/>
				</Suspense>
			</div>
		</section>
	);
}

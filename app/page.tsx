import { getServerSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { getUserRecommendation, getCurrentUserData } from '@/helper/getUser';
import { Suspense } from 'react';
import Suggestions from '@/components/Suggestions/Suggestions';
import Posts from './Posts';
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'InstaFams | Connect with peeple around the world',
}
export default async function Home() {
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

	const [sessions, usersLists] = await Promise.all([session, usersRecommendations]);
	const filteredUsers = usersLists?.filter((user) => {
		const isFollowing = followinglists.some((following: { userId: string }) => following.userId === user.uid);
		return !isFollowing;
	});

	return (
		<section className='w-full h-full md:p-3 max-w-7xl'>
			<div className='w-full flex justify-between items-start first:flex-grow'>
				<div className='w-full h-full flex flex-col p-5'>
						<Posts
							followinglists={followinglists}
							uid={session.user.uid}
							username={session.user.username}
						/>
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

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { db } from "@/config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google"

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button onClick={() => signIn(provider.id)}>
						Sign in with {provider.name}
					</button>
				</div>
			))}
		</>
	)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerSession(context.req, context.res, {
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID ?? '',
				clientSecret: process.env.GOOGLE_SECRET ?? '',
			}),
		],
		pages: {
			signIn: '/auth/signin'
		},
		callbacks: {
			async session({ session, token }: { session: any, token: JWT }) {
				if (session && session.user) {
					session.user.username = session.user?.name.split(' ').join('').toLocaleLowerCase();
					session.user.uid = token.sub;

				}
				await setDoc(doc(db, "users", `${token?.sub}`), {
					username: session.user.username = session.user.name.split(' ').join('').toLocaleLowerCase(),
					email: session.user?.email,
					image: session.user?.image,
					uid: token.sub,
					createdAt: Date.now()
				}, { merge: true });
				return session;
			}
		}
	});

	if (session) {
		return { redirect: { destination: "/" } };
	}

	const providers = await getProviders();

	return {
		props: { providers: providers ?? [] },
	}
}
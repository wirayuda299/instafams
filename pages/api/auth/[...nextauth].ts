import { db } from "@/config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { OAuth2Client } from "google-auth-library";
import { Session } from "inspector";
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google"
interface Props {
	session: Session
	token: any
	image: string
	email: string
	username: string | undefined
	uid: string | undefined
	name: string
}
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
});


export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
		})
	],
	pages: {
		signIn : '/auth/signin',
	},
	callbacks: {
		async session({ session, token }: { session: any, token: JWT }) {
			if (session && session.user) {
				session.user.username = session.user?.name.split(' ').join('').toLocaleLowerCase();
				session.user.uid = token.sub;

			}
			return session;
		}
	},
	
	
})
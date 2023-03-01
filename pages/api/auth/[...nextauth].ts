import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google"

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

export const authOptions = {
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
	
}
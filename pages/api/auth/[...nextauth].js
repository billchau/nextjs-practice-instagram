import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { theme } from "../../../tailwind.config"
export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signIn",
    },
    callbacks: {
        async session({ session, token, user }) {
            session.user.username = session.user.name.replace(" ", "").toLocaleLowerCase()
            session.user.uid = token.sub
            return session
        }

    }
})
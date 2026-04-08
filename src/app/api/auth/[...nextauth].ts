import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
// import your user model/DB query function
// import { getUserByEmail } from "@/lib/db"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Replace with your actual DB query
                // const user = await getUserByEmail(credentials.email)
                // if (!user) return null

                // Example user (replace with DB data)
                const user = {
                    id: "1",
                    email: "test@example.com",
                    // In real app, this comes from DB
                    password: await bcrypt.hash("password123", 10)
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
}

export default NextAuth(authOptions)
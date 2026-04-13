import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/utils/models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email }).select(
                    "+password",
                );

                if (!user) {
                    throw new Error("No user found with this email");
                }
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
                console.log('user login ' + user.name);
                
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.email = (user as any).email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).email = token.email;
            }
            return session;
        },
    },
    pages: {
        signIn: "/dev-login",
        error: "/dev-login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

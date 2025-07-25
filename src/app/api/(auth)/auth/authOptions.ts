
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "@/utils/validateCredentials";


interface CustomUser extends User {
  id: string;
  name?: string;
  role: string;
  phoneNumber?: string;
  email?: string;
  status?:string;
  isVerified?:boolean
}

    
interface CustomSession extends Session {
  user: CustomUser;
  accessToken: JWT;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,


  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Phone Login",
      credentials: {
        phoneNumber: { label: "Phone number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(creds) {
        if (!creds?.phoneNumber || !creds.password) return null;

        const user = await validateCredentials(creds.phoneNumber, creds.password);
        if (!user) return null;

        return {
          id: String(user._id),
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          email: user.email
        };
      }
    }),

    CredentialsProvider({
      id: "superadmin",
      name: "Super Admin Login",
      credentials: {
        email: { label: "E‑mail", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;


        const user = await validateCredentials(creds.email, creds.password);
        if (!user || user.role !== "super-admin") return null;

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        } as CustomUser;
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        Object.assign(token, user as CustomUser);
      }
      return token;
    },
    async session({ session, token }) {

      (session.user as CustomUser) = token as CustomUser;
      (session as CustomSession).accessToken = token;
      return session as CustomSession;
    }
  },

  pages: { signIn: "/auth/login" },
  debug: process.env.NODE_ENV === "development"
};
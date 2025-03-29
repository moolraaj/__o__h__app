import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/database/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
        },
        phoneNumber: {
          label: "Phone Number",
          type: "text",
          placeholder: "1234567890",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if ((!credentials?.phoneNumber && !credentials?.email) || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        let user = null;
        if (credentials.phoneNumber) {
          user = await User.findOne({ phoneNumber: credentials.phoneNumber });
        } else if (credentials.email) {
          user = await User.findOne({ email: credentials.email });
        }

        if (!user) {
          throw new Error("No user found with provided credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        let finalRole = user.role;
        if ((user.role === "admin" || user.role === "ambassador") && user.status !== "approved") {
          finalRole = "user";
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: finalRole,
        };


      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber;
        token.name = user.name;
        token.role = user.role;
        console.log("JWT Callback =>", token);
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        phoneNumber: token.phoneNumber as string,
        role: token.role as string,
      };
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};



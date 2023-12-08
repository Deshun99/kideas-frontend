import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { notFound } from "next/navigation";
import bcrypt from "bcryptjs";
import { getUserByUserId } from "../../user/route";
import Enums from "@/app/common/enums/enums";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: "email",
        password: "password",
        role: "role",
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/login?email=${email}&password=${password}&role=${role}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const responseBody = await res.json();

        if (responseBody.statusCode === 404) {
          throw new Error(responseBody.message || "An error occurred");
        }
        return {
          userId: responseBody.data.userId,
          name: responseBody.data.userName,
          email: responseBody.data.email,
          role: responseBody.data.role,
          status: responseBody.data.status,
          jwtAccessToken: responseBody.jwtAccessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("jwt callback", { token, user });
      if (user) {
        token.userId = user.userId;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.accessToken = user.jwtAccessToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session callback", { session, token });
      try {
        // for pages that uses useSession() to check if the user is authenticated, this session call back will be triggered
        // do a check from backend and database if the user still valid in database table or not
        // if no longer valid, it will catch the error and just return null session, and then the user will be auto logged out
        // else, the user remains logged in
        const result =
          token?.userId &&
          token?.role &&
          token?.accessToken &&
          (await getUserByUserId(token.userId, token.role, token.accessToken));
        const currentAccountStatus = result?.data?.status;
        console.log(`Current user account status: ${currentAccountStatus}`);
        if (currentAccountStatus === Enums.INACTIVE) {
          // sign out here since user no longer in database
          console.error(`SESSION API USER ERROR: ${error}`);
          session.error = "INVALID_USER";
          return session; // retrieve it from userContext.js and check if error is equal to 'INVALID_USER', if it is, sign user out to clear cookies
        }
      } catch (error) {
        // sign out here since user no longer in database
        console.error(`SESSION API USER ERROR: ${error}`);
        session.error = "INVALID_USER";
        return session; // retrieve it from userContext.js and check if error is equal to 'INVALID_USER', if it is, sign user out to clear cookies
      }

      session.user = {
        ...session.user,
        userId: token.userId,
        name: token.name,
        email: token.email,
        role: token.role,
        status: token.status,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/login",
  },
});

export { handler as GET, handler as POST };

/* eslint-disable jsdoc/no-missing-syntax */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";

// const cookies = {
//   sessionToken: {
//     name: `property-accounting.session-token`,
//     options: {
//       httpOnly: true,
//       secure: true,
//     },
//   },
//   csrfToken: {
//     name: "property-accounting.csrf-token",
//   },
// };

export const authOptions = {
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 hours
  },
  jwt: {
    maxAge: 60 * 60 * 8, // 8 hours
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { name, password } = credentials;

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, password }),
        };

        const response = await fetch(`${process.env.BASE_URL}/api/auth/post-login`, requestOptions);
        const user = await response.json();
        
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error("Invalid credentials");

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
      
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, ...rest }) {
      // called whenever a JWT is created or updated
      if (user) {
        token.uid = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      // called whenever a session is checked. So any calls to getSession(), useSession(), & /api/auth/session.
      // Send properties to the client, like an access_token and user id from a provider.
      // console.log(session, 'SESSION SESSION')
      // console.log(token, 'TOKEN SESSION')

      session.uid = token.uid;

      return session;
    }
  }
};

export default NextAuth(authOptions);
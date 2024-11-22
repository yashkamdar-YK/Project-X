// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions:NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',  // custom signin page
    error: '/auth/error',    // custom error page
  },
  callbacks:{
    async signIn({ account, profile }) {
      console.log("sign--In", account, profile)
      // {
      //   iss: 'https://accounts.google.com',
      //   azp: '391518889102-scio3tje2o37g56rgjudmgd4i87nadmh.apps.googleusercontent.com',
      //   aud: '391518889102-scio3tje2o37g56rgjudmgd4i87nadmh.apps.googleusercontent.com',
      //   sub: '118169845393797796283',
      //   email: 'socialmadiaankit@gmail.com',
      //   email_verified: true,
      //   at_hash: 'mMDn6EqF-rnSL-dRoqhBTw',
      //   name: 'Dev',
      //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocLnRIRGae5v1JdG4usLrusPKBgpj-HjY7jJXsmoiu8-lpvC0g=s96-c',
      //   given_name: 'Dev',
      //   iat: 1732275391,
      //   exp: 1732278991
      // }
      return true
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
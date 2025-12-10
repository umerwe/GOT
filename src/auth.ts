import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define the shape of your social login API response
interface SocialLoginResult {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    socialLoginResult?: SocialLoginResult;
  }

  interface User {
    socialLoginResult?: SocialLoginResult;
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    socialLoginResult?: SocialLoginResult;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && account.access_token) {
        try {
          const socialLoginData = {
            token: account.access_token,
            unique_id: user.id,
            email: user.email,
            medium: "google",
          };

          // Call the social-login API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/social-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(socialLoginData),
            }
          );

          if (!response.ok) {
            return false; // block sign in if API fails
          }

          const result: SocialLoginResult = await response.json();

          // Attach API result to the user object
          user.socialLoginResult = result;

          return true;
        } catch {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // Transfer the socialLoginResult from user to token
      if (user?.socialLoginResult) {
        token.socialLoginResult = user.socialLoginResult;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Make the socialLoginResult available in the session
      if (token.socialLoginResult) {
        session.socialLoginResult = token.socialLoginResult;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl + "/";
    },
  },
});

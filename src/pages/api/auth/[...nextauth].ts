import { config } from "@/utils/config";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET ?? process.env.ADMIN_SECRET ?? "dev-secret-change-me",
  providers: [
    CredentialsProvider({
      name: "Admin Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const password = process.env.ADMIN_PASSWORD;
        if (!password) {
          // No password set — allow any login in dev (open admin)
          return { id: "1", name: "Admin" };
        }
        if (credentials?.password === password) {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 hours
  callbacks: {
    async jwt({ token }) { return token; },
    async session({ session }) { return session; },
  },
});

export { handler as GET, handler as POST };

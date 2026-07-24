import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
        token.image = user.image || (user as any).avatar || null;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) || "CUSTOMER";
        session.user.image = (token.image as string) || session.user.image;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        if (user.id) {
          // Welcome bonus: 50 Collector Loyalty Points
          await prisma.loyaltyTransaction.create({
            data: {
              userId: user.id,
              points: 50,
              type: "EARNED",
              description: "Welcome Bonus for Joining Polacraft Cinema Club",
            },
          });
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loyaltyPoints: 50,
              role: "CUSTOMER",
              provider: "google",
            },
          });
        }
      } catch (e) {
        console.warn("[Auth.js Event createUser Error]:", e);
      }
    },
  },
});

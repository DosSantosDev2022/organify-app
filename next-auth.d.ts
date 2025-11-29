// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { SubscriptionStatus } from "@prisma/client"; // Importe o Enum do Prisma

// Estende o objeto User padrão do Next-Auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscriptionStatus: SubscriptionStatus;
      hasCompletedOnboarding:boolean
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    subscriptionStatus: SubscriptionStatus;
  }
}

// Estende o objeto JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionStatus: SubscriptionStatus;
    hasCompletedOnboarding: boolean;
  }
}
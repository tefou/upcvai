import { cache } from "react";
import prisma from "./prisma";

export type SubscriptionLevel = "free" | "pre";

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subscription = await prisma.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription || subscription.expiresAt < new Date()) {
      return "free";
    }

    if (subscription.isPremium === true) {
      return "pre";
    }

    throw new Error("Invalid subscription");
  }
);
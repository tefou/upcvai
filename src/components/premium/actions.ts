"use server"
import payos from '../../lib/payos';
import { currentUser } from "@clerk/nextjs/server"
import prisma from '@/lib/prisma';

export async function createCheckoutSession() {
    const user = await currentUser()

    if (!user) {
        throw new Error("Not Auth")
    }

    const orderCode = Math.floor(Math.random() * 1000000);

    const order = {
        amount: 39000,
        description: "Premium Package",
        orderCode: orderCode,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/billing/success`, 
        cancelUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/billing/cancel`,
    };

    const paymentLink = await payos.createPaymentLink(order);

    if (!paymentLink.checkoutUrl) {
        throw new Error("Failed to create payment link");
    }

    // Update the UserSubscription in Prisma upon successful payment
    await prisma.userSubscription.upsert({
        where: { userId: user.id },
        update: {
            payosorderCode: orderCode.toString(),
            status: "completed",
            isPremium: true,
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)) // Set to 30 days from now
        },
        create: {
            userId: user.id,
            payosorderCode: orderCode.toString(),
            status: "completed",
            isPremium: true,
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)) // Set to 30 days from now
        }
    });

    return paymentLink.checkoutUrl;
}
"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function Page() {
    try {
        const user = await currentUser();
        if (!user) {
            redirect("/sign-in");
        }

        // Validate user.id exists
        if (!user.id) {
            throw new Error("User ID not found");
        }

        // Fetch subscription with error handling
        const subscription = await prisma.userSubscription.findUnique({
            where: { userId: user.id },
        }).catch(error => {
            console.error("Database query failed:", error);
            throw new Error("Failed to fetch subscription");
        });

        // Use notFound() instead of throwing error for better UX
        if (!subscription || !subscription.payosorderCode) {
            notFound();
        }

        // Update subscription status with error handling
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "PAID",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        }).catch(error => {
            console.error("Failed to update subscription:", error);
            throw new Error("Failed to update subscription status");
        });

        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-bold">Thanh Toán Thành Công</h1>
                <p className="text-lg mt-2">Gói cước Premium đã đăng ký thành công!</p>
                <Link href="/resumes">
                    <Button className="mt-4">Bắt Đầu Trải Nghiệm Premium</Button>
                </Link>
            </div>
        );
    } catch (error) {
        console.error("Error in billing success page:", error);
        // Return an error UI instead of throwing
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi</h1>
                <p className="text-lg mt-2">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
                <Link href="/support">
                    <Button variant="outline" className="mt-4">Liên Hệ Hỗ Trợ</Button>
                </Link>
            </div>
        );
    }
}
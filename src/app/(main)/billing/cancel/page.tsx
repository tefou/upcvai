//billing/success/page.tsx
"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await currentUser();
        if (!user) {
            redirect("/sign-in");
        }

        // Lấy orderCode từ database
        const subscription = await prisma.userSubscription.findUnique({
            where: { userId: user.id },
        });

        if (!subscription || !subscription.payosorderCode) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "cancel",
                isPremium: false,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });

        return (
            <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
                <h1 className="text-3xl font-bold text-red-500">Thanh Toán Thất Bại</h1>
                <p>
                    Bạn đã đăng kí không thành công gói cước Premium !!!
                </p>
                <Button asChild className="text-white">
                    <Link href="/resumes">Hãy Đăng Kí Lại !!!</Link>
                </Button>
            </main>
        );
} 

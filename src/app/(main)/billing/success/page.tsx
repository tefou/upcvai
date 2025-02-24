// app/billing/success/page.tsx
"use server"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function updateSubscription() {
    'use server'
    
    try {
        const user = await currentUser();
        if (!user) {
            redirect("/sign-in");
        }

        const orderCode = Math.floor(Math.random() * 1000000);

        await prisma.userSubscription.upsert({
            where: { userId: user.id },
            update: {
                payosorderCode: orderCode.toString(),
                status: "completed",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30))
            },
            create: {
                userId: user.id,
                payosorderCode: orderCode.toString(),
                status: "completed",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30))
            }
        });
    } catch (error) {
        console.error("Error:", error);
        redirect("/billing/error");
    }
}

export default function Page() {
    return (
        <form action={updateSubscription}>
            <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
                <h1 className="text-3xl font-bold text-cyan-600">Thanh Toán Thành Công</h1>
                <p>
                    Gói cước Premium đã đăng kí thành công !!!
                </p>
                <Button type="submit" className="mb-4">Xác nhận nâng cấp Premium</Button>
                <br />
                <Button asChild className="text-yellow-500">
                    <Link href="/resumes">Bắt Đầu Trải Nghiệm Premium</Link>
                </Button>
            </main>
        </form>
    );
}
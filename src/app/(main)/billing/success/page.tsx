//billing/success/page.tsx
"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
    try {
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

        // Giả định rằng nếu user quay lại /billing/success thì họ đã thanh toán thành công
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "complete",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });

        return (
            <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
                <h1 className="text-3xl font-bold text-cyan-600">Thanh Toán Thành Công</h1>
                <p>
                    Gói cước Premium đã đăng kí thành công !!!
                </p>
                <Button asChild className="text-yellow-500">
                    <Link href="/resumes">Bắt Đầu Trải Nghiệm Premium</Link>
                </Button>
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        redirect("/resumes");
    }
}

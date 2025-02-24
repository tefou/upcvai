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
                status: "PAID",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });

        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-3xl font-bold text-yellow-600">Thanh Toán Thành Công</h1>
                <p className="text-lg mt-2">Gói cước Premium đã đăng ký thành công!</p>
                <Link href="/resumes">
                    <Button className="mt-4">Bắt Đầu Trải Nghiệm Premium</Button>
                </Link>
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        redirect("/billing/error");
    }
}

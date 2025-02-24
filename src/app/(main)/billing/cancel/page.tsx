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

        
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "cancelled",
                isPremium: false,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });

        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-bold">Thanh Toán Thất Bại</h1>
                <p className="text-lg mt-2">Bạn chưa đăng kí gói Premium thành công!</p>
                <Link href="/resumes">
                    <Button className="mt-4">Hãy Thử Lại Đăng Kí Lại !!!</Button>
                </Link>
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        redirect("/billing/cancel");
    }
}

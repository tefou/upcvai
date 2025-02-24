"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

        if (!subscription) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        // Cập nhật trạng thái đơn hàng thành "CANCELLED"
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "CANCELLED",
                isPremium: false,
            },
        });

        return (
            <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
                <h1 className="text-3xl font-bold text-red-500">Thanh Toán Thất Bại</h1>
                <p>Gói cước Premium chưa được đăng ký thành công.</p>
                <a href="/resumes">
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md">Thử Đăng Ký Lại</button>
                </a>
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái hủy thanh toán:", error);
        redirect("/resumes");
    }
}

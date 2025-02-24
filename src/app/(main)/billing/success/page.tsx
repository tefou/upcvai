"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
    const user = await currentUser();
    if (!user) {
        return redirect("/sign-in");
    }

    try {
        const { status, orderCode } = searchParams;
        
        if (!orderCode) {
            throw new Error("Thiếu orderCode trong URL");
        }

        // Chuyển đổi trạng thái từ PayOS thành hệ thống
        let newStatus = "pending"; // Mặc định là pending
        if (status === "PAID") newStatus = "completed";
        if (status === "CANCELLED") newStatus = "cancelled";

        // Lấy thông tin đơn hàng
        const subscription = await prisma.userSubscription.findUnique({
            where: { payosorderCode: orderCode },
        });

        if (!subscription) {
            console.error("Không tìm thấy đơn hàng:", orderCode);
            return redirect("/resumes");
        }

        // Cập nhật trạng thái trong database
        await prisma.userSubscription.update({
            where: { payosorderCode: orderCode },
            data: {
                status: newStatus,
                isPremium: newStatus === "completed",
                expiresAt: newStatus === "completed" 
                    ? new Date(new Date().setDate(new Date().getDate() + 30)) 
                    : subscription.expiresAt,
            },
        });

        // Nếu thanh toán thành công
        if (newStatus === "completed") {
            return (
                <main className="text-center">
                    <h1 className="text-3xl font-bold text-cyan-600">Thanh Toán Thành Công</h1>
                    <p>Gói cước Premium đã đăng ký thành công !!!</p>
                    <Button asChild className="text-yellow-500">
                        <Link href="/resumes">Bắt Đầu Trải Nghiệm Premium</Link>
                    </Button>
                </main>
            );
        }

        // Nếu thanh toán bị hủy
        return redirect("/billing/cancel");

    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        return redirect("/resumes");
    }
}

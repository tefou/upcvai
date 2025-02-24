"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await currentUser();
    if (!user) {
        return redirect("/sign-in");
    }

    try {
        // Lấy thông tin đơn hàng
        const subscription = await prisma.userSubscription.findUnique({
            where: { userId: user.id },
        });

        if (!subscription) {
            console.error("Không tìm thấy đơn hàng cho user:", user.id);
            return (
                <main className="text-center">
                    <h1 className="text-3xl font-bold text-red-500">Lỗi</h1>
                    <p>Không tìm thấy đơn hàng của bạn. Vui lòng thử lại.</p>
                    <Button asChild>
                        <Link href="/resumes">Quay lại</Link>
                    </Button>
                </main>
            );
        }

        // Cập nhật trạng thái đơn hàng
        await prisma.userSubscription.update({
            where: { userId: user.id },
            data: {
                status: "cancelled", // Kiểm tra xem có đúng giá trị trong DB không
                isPremium: false,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });

        return (
            <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
                <h1 className="text-3xl font-bold text-red-500">Thanh Toán Thất Bại</h1>
                <p>
                    Bạn đã đăng ký không thành công gói cước Premium !!!
                </p>
                <Button asChild className="text-white">
                    <Link href="/resumes">Hãy Đăng Ký Lại !!!</Link>
                </Button>
            </main>
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        return (
            <main className="text-center">
                <h1 className="text-3xl font-bold text-red-500">Có lỗi xảy ra</h1>
                <p>Không thể xử lý đơn hàng của bạn. Vui lòng thử lại.</p>
                <Button asChild>
                    <Link href="/resumes">Quay lại</Link>
                </Button>
            </main>
        );
    }
}

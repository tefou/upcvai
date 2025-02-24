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

    const { orderCode } = searchParams;
    if (!orderCode) {
        throw new Error("Thiếu orderCode trong URL");
    }

    console.log("Xử lý hủy thanh toán cho orderCode:", orderCode);

    // Lấy thông tin đơn hàng từ database
    const subscription = await prisma.userSubscription.findUnique({
        where: { payosorderCode: orderCode },
    });

    if (!subscription) {
        console.error("Không tìm thấy đơn hàng:", orderCode);
        return redirect("/resumes");
    }

    // Cập nhật trạng thái đơn hàng thành "cancel"
    await prisma.userSubscription.update({
        where: { payosorderCode: orderCode },
        data: {
            status: "cancel",
            isPremium: false,
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-2xl font-bold text-red-600">Thanh Toán Thất Bại</h1>
            <p className="text-lg mt-2">Bạn đã đăng ký không thành công gói cước Premium!</p>
            <Link href="/resumes">
                <Button className="mt-4">Hãy Đăng Ký Lại</Button>
            </Link>
        </div>
    );
}

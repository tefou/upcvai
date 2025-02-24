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

    // Lấy các tham số từ URL
    const { status, orderCode } = searchParams;
    if (!orderCode) {
        throw new Error("Thiếu orderCode trong URL");
    }

    console.log("Received status:", status, "for orderCode:", orderCode);

    // Tìm đơn hàng trong database
    const subscription = await prisma.userSubscription.findUnique({
        where: { payosorderCode: orderCode },
    });

    if (!subscription) {
        console.error("Không tìm thấy đơn hàng:", orderCode);
        return redirect("/resumes");
    }

    // Kiểm tra nếu status từ URL là "PAID" thì cập nhật database
    if (status === "PAID") {
        await prisma.userSubscription.update({
            where: { payosorderCode: orderCode },
            data: {
                status: "completed",
                isPremium: true,
                expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-2xl font-bold text-green-600">Thanh Toán Thành Công</h1>
            <p className="text-lg mt-2">Gói cước Premium đã đăng ký thành công!</p>
            <Link href="/resumes">
                <Button className="mt-4">Bắt Đầu Trải Nghiệm Premium</Button>
            </Link>
        </div>
    );
}

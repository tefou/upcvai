"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
            <h1 className="text-3xl font-bold text-red-500">Thanh Toán Thất Bại</h1>
            <p>Gói cước Premium chưa được đăng ký thành công.</p>
            <Button asChild>
                <Link href="/premium">Thử Đăng Ký Lại</Link>
            </Button>
        </main>
    );
}

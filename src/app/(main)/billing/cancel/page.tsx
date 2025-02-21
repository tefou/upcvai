import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Page(){
    return (
        <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
            <h1 className="text-3xl font-bold text-red-500">Thanh Toán Thất Bại</h1>
            <p>
                Gói cước Premium chưa được đăng kí thành công !!!
            </p>
            <Button asChild>
                <Link href="/resumes">Hãy Thử Đăng Kí Lần Nữa</Link>
            </Button>
        </main>
    )
}
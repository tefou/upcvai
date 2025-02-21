import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Page(){
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
    )
}
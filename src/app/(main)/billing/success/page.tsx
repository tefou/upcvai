// app/billing/success/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useFormState } from 'react-dom';
import prisma from "@/lib/prisma"; // Import Prisma
import { currentUser } from "@clerk/nextjs/server"; // Import currentUser

// Server Action (MUST be async)
async function updateSubscription() {
  'use server';

  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const orderCode = Math.floor(Math.random() * 1000000);

    await prisma.userSubscription.upsert({
      where: { userId: user.id },
      update: {
        payosorderCode: orderCode.toString(),
        status: "completed",
        isPremium: true,
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 30))
      },
      create: {
        userId: user.id,
        payosorderCode: orderCode.toString(),
        status: "completed",
        isPremium: true,
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 30))
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed to update subscription" };
  }
}

export default function Page() {
  const router = useRouter();
  // Change initial state to use undefined instead of null
  const [state, formAction] = useFormState(updateSubscription, { success: false, error: undefined });

  if (state.error) {
    // Handle error on the client-side
    console.error("Client-side error:", state.error);
    router.push("/billing/error"); // Client-side redirect
    return null; // Prevent further rendering
  }

  if(state.success){
    // Optionally refresh the route
    router.refresh();
  }

  return (
    <form action={formAction}>
      <main className="mx-auto max-w-7x1 space-y-6 px-3 py-6 text-center">
        <h1 className="text-3xl font-bold text-cyan-600">Thanh Toán Thành Công</h1>
        <p>
          Gói cước Premium đã đăng kí thành công !!!
        </p>
        <Button type="submit" className="mb-4">Xác nhận nâng cấp Premium</Button>
        <br />
        <Button asChild className="text-yellow-500">
          <Link href="/resumes">Bắt Đầu Trải Nghiệm Premium</Link>
        </Button>
      </main>
    </form>
  );
}
"use client"; // Nếu dùng Next.js 13+ App Router

import { SignIn, SignUp } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center">Welcome to My Auth Page</h1>
        
        {/* Bạn có thể tuỳ biến text, logo, ảnh... ở đây tuỳ ý */}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Khu vực Sign In */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Sign In</h2>
            <SignIn
              appearance={{
                elements: {
                  // Tuỳ chỉnh thêm className
                  formButtonPrimary:
                    "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded",
                },
              }}
            />
          </div>

          {/* Khu vực Sign Up */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

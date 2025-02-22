import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster";
import { viVN } from '@clerk/localizations'

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: {
    template:"%s | UP Team",
    absolute:"UP Team",
  },
  description: "Xây CV Dựng Ước Mơ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={viVN}>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}

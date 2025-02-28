"use client";

import logo from "@/assets/LogoUp_Black.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSubscriptionLevel } from "./SubscriptionLevelProvider";
import { LogoPremium } from "@/lib/permissions";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const subscriptionLevel = useSubscriptionLevel();
  const isPremium = LogoPremium(subscriptionLevel);

  // Đặt lại trạng thái loading khi đường dẫn thay đổi
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Chỉ bắt đầu loading khi không ở trang resumes
    if (pathname !== "/resumes") {
      setIsLoading(true);
      router.push("/resumes");
    }
  };

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className=" flex items-center gap-1 relative">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-full">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              )}
              <Image
                src={logo}
                alt="Logo"
                width={35}
                height={35}
                className="rounded-full"
              />
            </div>
            
            <span className="relative text-xl font-bold tracking-tight">
              UP
            </span>
            {isPremium && (
              <span className="relative text-sm -top-1">
                Premium
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Trạng thái thanh toán"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
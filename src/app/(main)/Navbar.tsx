"use client";

import logo from "@/assets/LogoUp_Black.png";
import { UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSubscriptionLevel } from "./SubscriptionLevelProvider";
import { LogoPremium } from "@/lib/permissions";
import dynamic from "next/dynamic";

// Define proper interfaces for the props
interface User {
  id: string;
  fullName: string;
}

interface SubscriptionDetails {
  createdAt: string;
  expiresAt: string;
}

interface Subscription {
  level: string;
  details: SubscriptionDetails | null;
}

interface NavbarProps {
  userData?: User | null;
  subscriptionData?: Subscription | null;
}

// Dynamically import BillingUI to use client component in Navbar
const BillingUI = dynamic(() => import("../(main)/billing/billing-ui"), { 
  ssr: false,
  loading: () => <div className="p-4">Chờ chút xíu nha...</div>
});

export default function Navbar({ userData, subscriptionData }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const subscriptionLevel = useSubscriptionLevel();
  const isPremium = LogoPremium(subscriptionLevel);
  const [showBillingInfo, setShowBillingInfo] = useState(false);

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
          <div className="flex items-center gap-1 relative">
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
          {/* Always show the button for better visibility and testing */}
          <button 
            onClick={() => setShowBillingInfo(true)} 
            className="px-1 py-2 bg-black text-white rounded-md text-xs hover:bg-gray-800 transition-colors"
          >
            Thông Tin Tài Khoản
          </button>
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
            {/* <UserButton.MenuItems>
              <UserButton.Link
                label="Trạng thái thanh toán"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems> */}
          </UserButton>
        </div>
      </div>

      {/* Use BillingUI as a component with forced visibility control */}
      {showBillingInfo && (
        <div className="fixed inset-0 z-50" onClick={() => setShowBillingInfo(false)}>
          <div 
            className="absolute right-0 top-0 h-full"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
          >
            <BillingUI 
              user={userData || { id: "guest", fullName: "Khách" }}
              subscription={subscriptionData || { level: "free", details: null }}
              initialOpenState={true}
              onClose={() => setShowBillingInfo(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
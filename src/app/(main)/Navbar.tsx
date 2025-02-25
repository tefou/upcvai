"use client";

import logo from "@/assets/LogoUp_Black.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSubscriptionLevel } from "./SubscriptionLevelProvider";
import { LogoPremium } from "@/lib/permissions";

export default function Navbar() {
  const subscriptionLevel = useSubscriptionLevel();
  const isPremium = LogoPremium(subscriptionLevel);

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          <div className="absolute flex items-center gap-1">
            <Image
              src={logo}
              alt="Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            
            <span className="relative text-xl font-bold tracking-tight">
              UP
            </span>
            {isPremium && (
              <span className="relative text-sm -top-1">
                Premium
              </span>
            )}
          </div>
        </Link>
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
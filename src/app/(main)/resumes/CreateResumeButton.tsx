"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare, AlertCircle } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
  totalCount: number; // Thêm prop để biết số lượng CV hiện tại
}

export default function CreateResumeButton({
  canCreate,
  totalCount,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();
  
  // Kiểm tra nếu đã đạt giới hạn 3 CV
  if (totalCount >= 2) {
    return (
      <Button
        disabled
        className="mx-auto flex w-fit gap-2 bg-gray-400 text-gray-700 cursor-not-allowed"
      >
        <AlertCircle className="size-5" />
        Bạn đã đạt giới hạn 2 CV
      </Button>
    );
  }

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2 bg-cyan-600 hover:bg-cyan-500">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          Tạo CV Mới
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2 bg-black hover:bg-yellow-500 text-yellow-600 hover:text-black"
    >
      <PlusSquare className="size-5" />
      Nâng Cấp Premium để Tạo CV Mới
    </Button>
  );
}
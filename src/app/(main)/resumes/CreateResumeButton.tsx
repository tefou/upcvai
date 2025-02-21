"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();

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
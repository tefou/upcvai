"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUserIcon, Loader2, PenLineIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);
  
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  // Reset loading state when path changes
  useEffect(() => {
    setIsClosing(false);
  }, [pathname]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClosing(true);
    router.push("/resumes");
  };

  return (
    <footer className="w-full border-t px-3 py-5 items-center justify-between flex bg-white shadow-md transition-transform duration-300">
      <div className="mx-auto flex max-w-7xl justify-between gap-3 items-center" >
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Quay Lại
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Kế Tiếp
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden"
          title={
            showSmResumePreview ? "Show input form" : "Show resume preview"
          }
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isClosing}
            className="relative"
          >
            {isClosing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Đang đóng...</span>
              </>
            ) : (
              "Đóng"
            )}
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100",
            )}
          >
            Đang Lưu...
          </p>
        </div>
      </div>
    </footer>
  );
}
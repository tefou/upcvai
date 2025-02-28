"use client";

import LoadingButton from "@/components/LoadingButton";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Loader2, MoreVertical, Printer, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import { deleteResume } from "./actions";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "CV",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Chuyển hướng đến trang editor sau khi đặt trạng thái loading
    setTimeout(() => {
      router.push(`/editor?resumeId=${resume.id}`);
    }, 500); // Thêm timeout để hiển thị trạng thái loading
  };

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <div 
          onClick={handleResumeClick}
          className="inline-block w-full text-center cursor-pointer"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Đã cập nhật" : "Đã được tạo"} vào lúc{" "}
            {formatDate(resume.updatedAt, "HH:mm dd/MM/yyyy")}
          </p>
        </div>
        <div
          onClick={handleResumeClick}
          className="relative inline-block w-full cursor-pointer"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/60 z-10 rounded-lg">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            contentRef={contentRef}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="size-4" />
            Xóa
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
            In
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn Muốn Xóa CV ?</DialogTitle>
          <DialogDescription>
            Đây là hành động có thể làm mất CV của bạn vĩnh viễn. 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            Xóa
          </LoadingButton>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
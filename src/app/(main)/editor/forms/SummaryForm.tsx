import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";
import { PrinterIcon } from "@heroicons/react/24/outline";

export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Mô Tả Về Bạn</h2>
        <p className="text-sm text-muted-foreground">
          Hãy viết mô tả về bản thân của bạn.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Mô Tả Về Bạn</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="ví dụ: Mục tiêu của tôi trong 5 năm tiếp theo là trưởng phòng kinh doanh"
                  />
                </FormControl>
                <FormMessage />
                <GenerateSummaryButton
                  resumeData={resumeData}
                  onSummaryGenerated={(summary) =>
                    form.setValue("summary", summary)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {/* <button
        onClick={handlePrint}
        className="fixed bottom-4 right-4 flex items-center px-4 py-2 bg-black text-white rounded shadow hover:bg-slate-800 focus:outline-none"
      >
        <PrinterIcon className="h-5 w-5 mr-2" />
        In
      </button> */}
    </div>
  );
}

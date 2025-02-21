"use client"

// import GeneralInfoForm from "./forms/GeneralInfoForm";
// import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSaveResume from "./useAutoSaveResume";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps{
    resumeToEdit: ResumeServerData | null
}

export default function ResumeEditor({resumeToEdit}: ResumeEditorProps){
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
      resumeToEdit ? mapToResumeValues(resumeToEdit) : {},
    );
    const [showSmResumePreview, setShowSmResumePreview] = useState(false);

    const {isSaving, hasUnsavedChanges} = useAutoSaveResume(resumeData)

    useUnloadWarning(hasUnsavedChanges);

    

    const currentStep = searchParams.get("step") || steps[0].key;

    function setStep(key: string) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("step", key);
      window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    const FormComponent = steps.find(
      (step) => step.key === currentStep,
    )?.component;

    return (
        <div className="flex grow flex-col">
          <header className="space-y-1.5 border-b px-3 py-5 text-center">
            <h1 className="text-2xl font-bold">Thiết Kế CV của Bạn</h1>
            <p className="text-sm text-muted-foreground">
              Bạn hãy làm theo các bước. CV của bạn được tự động lưu.
            </p>
          </header>
          <main className="relative grow">
            <div className="absolute bottom-0 top-0 flex w-full">
                <div className="w-full p-3 md:w-1/2">
                  <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
                  {FormComponent && (
                    <FormComponent
                      resumeData={resumeData}
                      setResumeData={setResumeData}
                    />
                  )}
                </div>
                <div className="grow md:border-r"/>
                <ResumePreviewSection
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  className={cn(showSmResumePreview && "flex")}
                />
            </div>
          </main>
          
          <Footer
            currentStep={currentStep}
            setCurrentStep={setStep}
            showSmResumePreview={showSmResumePreview}
            setShowSmResumePreview={setShowSmResumePreview}
            isSaving={isSaving}
          />
        </div>
    );
}
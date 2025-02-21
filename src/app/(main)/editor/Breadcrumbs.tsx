import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";

interface BreadcrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({
  currentStep,
  setCurrentStep,
}: BreadcrumbsProps) {
  return (
    <div className="flex justify-center mb-8">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage
                    className="px-4 py-2 bg-black text-white border-2 border-black rounded-md clip-path-diamond"
                  >
                    {step.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button
                      onClick={() => setCurrentStep(step.key)}
                      className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-all clip-path-diamond"
                    >
                      {step.title}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {/* Separator */}
              {index < steps.length - 1 && (
                <BreadcrumbSeparator className="mx-2 text-gray-400 last:hidden">
                  <span className="text-lg">›</span>
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

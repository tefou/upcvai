import EducationForm from "./forms/EducationForm";
import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";


export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>
  key: string;
}[] = [
  { title: "Thông Tin CV", component: GeneralInfoForm, key: "general-info" },
  { title: "Cá Nhân", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Kinh Nghiệm",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  { title: "Học Vấn", component: EducationForm, key: "education" },
  { title: "Kỹ Năng", component: SkillsForm, key: "skills" },
  {
    title: "Tổng Quan",
    component: SummaryForm,
    key: "summary",
  },
];

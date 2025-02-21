"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Info, FileUser, BriefcaseBusiness, GraduationCap, Lightbulb, ScrollText } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";

// Import ảnh từ thư mục public
import stepBuild1 from "@/assets/GifSteps/StepBuild_Step1.gif";
import stepBuild2 from "@/assets/GifSteps/StepBuild_Step2.gif";
import stepBuild3 from "@/assets/GifSteps/StepBuild_Step3.gif";
import stepBuild4 from "@/assets/GifSteps/StepBuild_Step4.gif";
import stepBuild5 from "@/assets/GifSteps/StepBuild_Step5.gif";
import stepBuild6 from "@/assets/GifSteps/StepBuild_Step6.gif";

interface ModalContent {
  title: string;
  image: string;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({ title: "", image: "" });

  const openModal = (title: string, image: string) => {
    setModalContent({ title, image });
    setIsOpen(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="relative z-50 py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-blue-500 md:text-5xl lg:text-6xl">
          Tạo CV Của Bạn với <span className="text-primary">UP</span>
        </h1>
        <p className="mb-6 text-lg font-normal text-slate-400 lg:text-xl">
          Xây Ước Mơ - Dựng Tương Lai
        </p>

        <Link href="/resumes">
          <button className="py-3 px-5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-600">
            Bắt Đầu Trải Nghiệm
          </button>
        </Link>
      </section>

      {/* Bước Hướng Dẫn */}
      <section className="py-8 bg-white px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h2 className="font-bold text-3xl">Các Bước Để Có CV Hoàn Hảo</h2>
        <p className="text-md text-gray-500">Điền thông tin theo các bước trên hệ thống của UP Team</p>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "1. Thông Tin Về CV",
              description: "Mô tả mục đích sử dụng CV của bạn.",
              icon: <Info />,
              image: stepBuild1.src,
            },
            {
              title: "2. Thông Tin Cá Nhân",
              description: "Thông tin cá nhân đầy đủ sẽ cho nhà tuyển dụng biết bạn là ai.",
              icon: <FileUser />,
              image: stepBuild2.src,
            },
            {
              title: "3. Kinh Nghiệm",
              description: "Liệt kê kinh nghiệm làm việc quan trọng.",
              icon: <BriefcaseBusiness />,
              image: stepBuild3.src,
            },
            {
              title: "4. Học Vấn",
              description: "Cung cấp thông tin về trình độ học vấn.",
              icon: <GraduationCap />,
              image: stepBuild4.src,
            },
            {
              title: "5. Kỹ Năng",
              description: "Nhà tuyển dụng quan tâm đến việc bạn có thể làm được gì.",
              icon: <Lightbulb />,
              image: stepBuild5.src,
            },
            {
              title: "6. Tổng Quan",
              description: "Giới thiệu bản thân để gây ấn tượng với nhà tuyển dụng.",
              icon: <ScrollText />,
              image: stepBuild6.src,
            },
          ].map((step, index) => (
            <button
            key={index}
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-blue-500/10 w-full text-left"
            onClick={() => openModal(step.title, step.image)}
          >
            {step.icon}
            <h2 className="mt-4 text-xl font-bold text-black">{step.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{step.description}</p>
          </button>
          ))}
        </div>
      </section>

      {/* Modal Popup */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <Dialog.Panel className="w-full max-w-screen-lg bg-white rounded-lg shadow-xl p-6 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title className="text-lg font-semibold text-center">{modalContent.title}</Dialog.Title>
            <div className="mt-4 w-full flex justify-center">
              <Image src={modalContent.image} alt="Hướng dẫn" width={800} height={600} className="rounded-lg object-contain" />
            </div>
            <button className="mt-4 w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4 text-center mt-12">
        <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="https://www.facebook.com/upteam.cv" target="_blank" aria-label="Facebook" className="hover:text-gray-400">
                <svg fill="#fff" height="22px" width="22px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 32 32">
                  <path d="M23,0H9C4,0,0,4,0,9v14c0,5,4,9,9,9h7V20h-4c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1h4v-3c0-3.3,1.7-6,5-6h4c0.6,0,1,0.4,1,1v3
                    c0,0.6-0.4,1-1,1h-3.8c-0.1,0-0.2,0.1-0.2,0.2V15h5c0.3,0,0.6,0.2,0.8,0.4s0.2,0.6,0.1,0.9l-2,3C24.8,19.8,24.4,20,24,20h-3v12h2
                    c5,0,9-4,9-9V9C32,4,28,0,23,0z"/>
                </svg>
                </Link>
                <Link href="https://www.youtube.com/@upteamAI" target='_blank' aria-label="YouTube" className="hover:text-gray-400">
                  <svg fill="#fff" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z"/></svg>
                </Link>
              </div>
              <span className="bg-blue-800 text-white py-4 text-center">&copy; UP Team</span>
            </div>
      </footer>
    </div>
  );
}

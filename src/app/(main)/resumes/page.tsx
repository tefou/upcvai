import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { resumeDataInclude } from "@/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";


export const metadata: Metadata = {
  title: "CV của Bạn",
  icons: "D:/LEARNS/AtSchool/FPT UNIVERSITY/EXE/UPproject/upcvai/src/assets/LogoUp_Black.png",
};

const getTimeBasedContent = () => {
  const hour = new Date().getHours();
  console.log(hour);
  
  // Morning (5AM - 9:59AM)
  if (hour >= 5 && hour < 10) {
    const morningWishes = [
      "Chúc bạn một ngày tràn đầy năng lượng và thành công",
      "Hãy bắt đầu ngày mới với nụ cười và niềm vui",
      "Chúc bạn có một buổi sáng tràn đầy cảm hứng",
      "Ngày mới hứa hẹn nhiều điều tốt đẹp đang chờ đợi bạn",
      "Hãy khởi đầu ngày mới đầy hứng khởi nhé"
    ];
    
    return {
      greeting: "Chào buổi sáng",
      wish: morningWishes[Math.floor(Math.random() * morningWishes.length)],
      background: "from-cyan-600 via-blue-500 to-sky-400", // Sunrise colors
    };
  }
  
  // Noon (10AM - 12:59PM)
  if (hour >= 10 && hour < 13) {
    const noonWishes = [
      "Chúc bạn có bữa trưa ngon miệng và bổ dưỡng",
      "Hãy nạp năng lượng cho nửa ngày còn lại",
      "Hy vọng buổi sáng của bạn đã trôi qua tốt đẹp",
      "Thời điểm hoàn hảo để nghỉ ngơi giữa ngày",
      "Đừng quên dành thời gian thư giãn vào buổi trưa"
    ];
    
    return {
      greeting: "Chào buổi trưa",
      wish: noonWishes[Math.floor(Math.random() * noonWishes.length)],
      background: "from-amber-500 via-yellow-500 to-orange-400", // Midday sun colors
    };
  }
  
  // Afternoon (1PM - 4:59PM)
  if (hour >= 13 && hour < 17) {
    const afternoonWishes = [
      "Hy vọng công việc của bạn luôn suôn sẻ",
      "Hãy duy trì năng lượng tích cực trong buổi chiều này",
      "Chúc bạn có một buổi chiều hiệu quả và thành công",
      "Hãy tận hưởng năng lượng của buổi chiều",
      "Hy vọng bạn đang có một ngày làm việc tuyệt vời"
    ];
    
    return {
      greeting: "Xin Chào",
      wish: afternoonWishes[Math.floor(Math.random() * afternoonWishes.length)],
      background: "from-orange-400 via-yellow-300 to-amber-200", // Afternoon colors
    };
  }
  
  // Evening/Night (5PM - 4:59AM)
  const eveningWishes = [
    "Hãy thư giãn sau một ngày làm việc chăm chỉ",
    "Chúc bạn có một buổi tối bình yên và ấm áp",
    "Đã đến lúc nghỉ ngơi và tận hưởng buổi tối thư thái",
    "Hãy dành thời gian cho những điều bạn yêu thích vào buổi tối nay",
    "Chúc bạn một buổi tối vui vẻ bên người thân và bạn bè"
  ];
  
  // Late evening with darker colors (after 9PM)
  if (hour >= 21 || hour < 5) {
    return {
      greeting: "Chúc ngủ ngon",
      wish: eveningWishes[Math.floor(Math.random() * eveningWishes.length)],
      background: "from-blue-900 via-indigo-800 to-purple-900", // Night colors
    };
  }
  
  // Early evening (5PM - 8:59PM)
  return {
    greeting: "Chào buổi tối",
    wish: eveningWishes[Math.floor(Math.random() * eveningWishes.length)],
    background: "from-purple-700 via-orange-600 to-pink-500", // Sunset colors
  };
};

const formatDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const rawDate = date.toLocaleDateString('vi-VN', options);
  console.log(rawDate)
  
  // Transform from "Thứ Năm, 20 tháng 2, 2025" to "Thứ Năm, ngày 20 tháng 2 năm 2025"
  const parts = rawDate.split(',');
  if (parts.length >= 2) {
    const weekday = parts[0].trim();
    const dateSection = parts[1].trim();
    // Extract day, month, year
    const dateMatch = dateSection.match(/(\d+) tháng (\d+), (\d+)/);
    if (dateMatch) {
      return `${weekday}, ngày ${dateMatch[1]} tháng ${dateMatch[2]} ${dateMatch[3]}`;
    }
  }
  
  // Fallback in case the format doesn't match expectations
  return `${rawDate.replace(', ', ', ngày ').replace(', ', ' ')}`;
};

export default async function Page() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);

  const { greeting, wish, background } = getTimeBasedContent();
  // console.log(formatDate);
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      {/* Greeting Section with Dynamic Background */}
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${background} p-8 shadow-lg`}>
        <div className="relative z-10">
          <h1 className="mb-2 font-serif text-4xl font-medium tracking-wide text-white">
            {`${greeting}, ${user?.firstName || 'thien'}`}
          </h1>
          <p className="text-blue-100 mb-2">
            {formatDate()}
          </p>
          <p className="text-blue-50 text-lg italic">
            {wish}
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="mt-8 space-y-8">
        <CreateResumeButton
          canCreate={canCreateResume(subscriptionLevel, totalCount)}
        />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-cyan-700">CV của Bạn</h2>
            <div className="rounded-lg bg-cyan-50 px-4 py-2">
              <p className="text-cyan-700">
                Bạn đang có {" "}
                <span className="text-xl font-bold text-cyan-600">
                  {totalCount}
                </span> CV
              </p>
            </div>
          </div>
          
          {/* Resumes Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {resumes.map((resume) => (
              <ResumeItem key={resume.id} resume={resume} />
            ))}
          </div>
          
          {/* Empty State */}
          {resumes.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">
                Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn!
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <span className="items-center justify-between text-black py-4 text-center">&copy; UP Team</span>
      </div>
    </main>
  );
}
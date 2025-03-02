import PremiumModal from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { auth, currentUser } from "@clerk/nextjs/server";
import Navbar from "./Navbar";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";
import prisma from '@/lib/prisma';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Fetch user data (integrating from Billing layout)
  const user = await currentUser();
  
  let userData = null;
  let subscriptionData = null;
  
  if (user) {
    // Lấy trạng thái subscription
    const userSubscriptionLevel = await getUserSubscriptionLevel(user.id);
    
    // Lấy thông tin chi tiết từ database
    const subscriptionDetails = await prisma.userSubscription.findUnique({
      where: { 
        userId: user.id,
      }
    });
    
    userData = {
      id: user.id,
      fullName: user.fullName || "Người dùng"
    };
    
    subscriptionData = {
      level: userSubscriptionLevel,
      details: subscriptionDetails ? {
        createdAt: subscriptionDetails.createdAt.toISOString(),
        expiresAt: subscriptionDetails.expiresAt.toISOString()
      } : null
    };
  }

  return (
    <SubscriptionLevelProvider userSubscriptionLevel={subscriptionData?.level || 'free'}>
      <div className="flex min-h-screen flex-col">
        <Navbar userData={userData} subscriptionData={subscriptionData} />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionLevelProvider>
  );
}
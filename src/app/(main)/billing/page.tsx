import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from '@/lib/subscriptions';
import prisma from '@/lib/prisma';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function BillingPage() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Vui lòng đăng nhập để xem thông tin</div>;
  }

  // Lấy trạng thái subscription
  const subscriptionLevel = await getUserSubscriptionLevel(user.id);
  
  // Lấy thông tin chi tiết từ database
  const subscriptionDetails = await prisma.userSubscription.findUnique({
    where: { 
      userId: user.id,
    }
  });

  return (
    <div className="w-full pt-4">
      <div className="max-w-full px-4">
        <div className="w-full bg-gray-100 rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">Trạng thái tài khoản</h2>
          
          {subscriptionLevel === "pre" && subscriptionDetails ? (
            <div className="bg-slate-900 p-6 rounded-lg w-full">
              <h3 className="text-xl font-semibold text-yellow-600">
                Bạn đang sử dụng gói Premium
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-yellow-500">
                  Bạn đã trở thành Premium vào ngày {new Date(subscriptionDetails.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-yellow-500">
                  Gói cước Premium sẽ hết hạn vào ngày {new Date(subscriptionDetails.expiresAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-yellow-300">
                  Bạn còn {formatDistance(
                    new Date(subscriptionDetails.expiresAt),
                    new Date(),
                    { locale: vi, addSuffix: true }
                  )} là hết gói cước Premium
                </p>
                <div className="flex justify-center mt-6">
                  <Link href="/resumes">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6">
                      Trải nghiệm Premium 
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-200 p-6 rounded-lg w-full">
              <h3 className="text-xl font-semibold text-black">
                Tài khoản Free
              </h3>
              <p className="text-slate-800 mt-2">
                Bạn đang sử dụng gói miễn phí và các tính năng sẽ bị giới hạn
              </p>
              <div className="flex justify-center mt-6">
                <Link href="/resumes">
                  <Button className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6">
                    Đến trang thiết kế nào
                  </Button>
                </Link>
              </div>  
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
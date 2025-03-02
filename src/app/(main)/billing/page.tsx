// app/(main)/billing/page.jsx
// This is server-side of billing page
import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from '@/lib/subscriptions';
import prisma from '@/lib/prisma';
import BillingUI from './billing-ui';

export default async function BillingPage() {
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

  // Pass the server-fetched data to the client component
  return (
    <BillingUI 
      user={{
        id: user.id,
        fullName: user.fullName || "Người dùng"
      }}
      subscription={{
        level: subscriptionLevel,
        details: subscriptionDetails ? {
          createdAt: subscriptionDetails.createdAt.toISOString(),
          expiresAt: subscriptionDetails.expiresAt.toISOString()
        } : null
      }}
    />
  );
}
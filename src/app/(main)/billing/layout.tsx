//this is layout of Billing information

import React, { ReactNode } from 'react';
// import { currentUser } from "@clerk/nextjs/server";
// import { getUserSubscriptionLevel } from '@/lib/subscriptions';
// import prisma from '@/lib/prisma';
// import Navbar from '../Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: LayoutProps) {
  // Fetch user data
  // const user = await currentUser();
  
  // let userData = null;
  // let subscriptionData = null;
  
  // if (user) {
  //   // Lấy trạng thái subscription
  //   const subscriptionLevel = await getUserSubscriptionLevel(user.id);
    
  //   // Lấy thông tin chi tiết từ database
  //   const subscriptionDetails = await prisma.userSubscription.findUnique({
  //     where: { 
  //       userId: user.id,
  //     }
  //   });
    
    // userData = {
    //   id: user.id,
    //   fullName: user.fullName || "Người dùng"
    // };
    
    // subscriptionData = {
    //   level: subscriptionLevel,
    //   details: subscriptionDetails ? {
    //     createdAt: subscriptionDetails.createdAt.toISOString(),
    //     expiresAt: subscriptionDetails.expiresAt.toISOString()
    //   } : null
    // };
  // }
  
  return (
    <div>
      {/* <Navbar userData={userData} subscriptionData={subscriptionData} /> */}
      <main>{children}</main>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  fullName: string;
}

interface SubscriptionDetails {
  createdAt: string;
  expiresAt: string;
}

interface Subscription {
  level: string;
  details: SubscriptionDetails | null;
}

interface BillingUIProps {
  user: User;
  subscription: Subscription;
  initialOpenState?: boolean;
  onClose?: () => void;
}

export default function BillingUI({ 
  user, 
  subscription, 
  initialOpenState = false,
  onClose 
}: BillingUIProps) {
  const [closeMenu, setCloseMenu] = useState(!initialOpenState);
  
  // Update local state when initialOpenState prop changes
  useEffect(() => {
    setCloseMenu(!initialOpenState);
  }, [initialOpenState]);
  
  // Handle close action
  const handleClose = () => {
    setCloseMenu(true);
    if (onClose) {
      onClose();
    }
  };
  
  const isGuest = user.id === "guest";
  
  return (
    <div>
      {/* Only show the button when not controlled externally */}
      {!initialOpenState && (
        <button 
          onClick={() => setCloseMenu(!closeMenu)} 
          className="px-4 py-2 bg-black text-white"
        >
          Xem thông tin
        </button>
      )}
      
      <div 
        className={`fixed ${closeMenu ? "translate-x-[100%]" : "translate-x-0"} p-4 h-screen w-[300px] bg-blue-950 text-white top-0 right-0 shadow-2xl transition-all duration-700 z-50`}
      >
        <div className="flex items-center gap-2">
          <svg
            onClick={handleClose}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x cursor-pointer"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          Trạng Thái Tài Khoản
        </div>
        
        {isGuest ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h3>
              <p className="mb-6">Đăng nhập để xem thông tin tài khoản của bạn</p>
              <Link href="/sign-in">
                <Button className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="my-10 space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 flex items-center justify-center bg-green-900 rounded-full text-white font-bold">
                  {user.fullName.substring(0, 1).toUpperCase()}
                </div>
              </div>
              <div className="font-bold text-center text-[18px]">
                {user.fullName}
              </div>
            </div>
            <div className="w-full pt-4">
              <div className="max-w-full px-4">
                <div className="w-ful rounded-md p-6">
                  {subscription.level === "pre" && subscription.details ? (
                    <div className="bg-slate-900 p-6 rounded-lg w-full">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-yellow-700 to-amber-500 rounded-full px-5 py-2 text-white font-bold flex items-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="gold" />
                            <circle cx="12" cy="12" r="3" fill="white" />
                          </svg>
                          <span className="mr-1 text-sm tracking-wider uppercase">Premium</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-3">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <div>
                            <p className="text-gray-400 text-xs">Ngày Đăng Ký</p>
                            <p className="text-yellow-600 font-medium">
                              {new Date(subscription.details.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-3">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <div>
                            <p className="text-gray-400 text-xs">Ngày Hết Hạn</p>
                            <p className="text-yellow-600 font-medium">
                              {new Date(subscription.details.expiresAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-3">
                          <path d="M5 22h14" />
                          <path d="M5 2h14" />
                          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                        </svg>
                          <div>
                            <p className="text-gray-400 text-xs">Còn Lại</p>
                            <p className="text-yellow-600 font-medium">
                              {formatDistance(new Date(subscription.details.expiresAt), new Date(), {
                                locale: vi,
                                addSuffix: false,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-200 p-6 rounded-lg w-full">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-400 rounded-full px-4 py-2 text-black font-bold flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          Miễn Phí
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-300 p-3 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-3">
                            <path d="M12 2v2"/>
                            <path d="M12 20v2"/>
                            <path d="m4.93 4.93 1.41 1.41"/>
                            <path d="m17.66 17.66 1.41 1.41"/>
                            <path d="M2 12h2"/>
                            <path d="M20 12h2"/>
                            <path d="m6.34 17.66-1.41 1.41"/>
                            <path d="m19.07 4.93-1.41 1.41"/>
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">Bạn đang bị giới hạn chức năng</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-300 p-3 rounded-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-3">
                            <path d="M3 20h18a1.94 1.94 0 0 0 1.84-1.38l-7.92-13.18a1.93 1.93 0 0 0-3.38.18L3.6 18.6A1.94 1.94 0 0 0 3 20z"/>
                            <path d="M12 8v4"/>
                            <path d="M12 16h.01"/>
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">Bạn chỉ dùng được các tính năng cơ bản</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
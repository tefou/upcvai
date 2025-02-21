import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import logoUpBlack from "@/assets/LogoUp_Black.png";


function Header() {
  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-between gap-2">
          <Image src={logoUpBlack} alt="UP" width={30} height={30} />
          UP Team
        </Link>
        {/* <nav className="space-x-4">
          <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-primary">
            Features
          </Link>
          <Link href="/billing" className="text-gray-600 dark:text-gray-300 hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary">
            About
          </Link>
        </nav> */}

        <Link href="/resumes">
          <div>
            <button className="text-sm px-4 py-2 text-white bg-blue-700 rounded-lg">Bắt Đầu Trải Nghiệm</button>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;

// src/components/Header.js
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const router = useRouter();
  const { text } = useLanguage(); // Get translated text

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex items-center">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={text.goBack} // Use translated text
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" aria-label="Back to Homepage">
              {/* Assuming you have a logo.png in your /public folder */}
              <Image src="/logo.png" alt="Wyncell Logo" width={120} height={35} priority />
            </Link>
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </header>
  );
}
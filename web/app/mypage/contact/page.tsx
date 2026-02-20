'use client';

import { useState } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';

const CONTACT_EMAIL = 'mechuragi001@gmail.com';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/mypage" title="문의하기" />

      <div className="flex-1 pt-14 pb-20 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#3CDCBA]/10 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#3CDCBA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-2">이메일로 문의해 주세요</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          서비스 이용 중 불편한 점이나 제안 사항을<br />아래 이메일로 보내주시면 확인 후 답변 드리겠습니다.
        </p>

        <div className="w-full bg-gray-50 rounded-2xl px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">{CONTACT_EMAIL}</span>
          <button
            onClick={handleCopy}
            className={`ml-3 shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              copied
                ? 'bg-[#3CDCBA] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      </div>

      <Footer type="nav" />
    </div>
  );
}

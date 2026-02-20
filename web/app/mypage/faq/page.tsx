'use client';

import { useState } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';

const faqs = [
  {
    question: '메추라기는 어떤 서비스인가요?',
    answer: '메추라기는 AI가 날씨, 기분, 시간 등을 분석해 오늘의 메뉴를 추천해주는 서비스입니다. 커뮤니티에서 다른 사용자들과 메뉴 투표도 즐길 수 있어요.',
  },
  {
    question: 'AI 메뉴 추천은 어떻게 작동하나요?',
    answer: '현재 날씨, 기분, 식사 시간대, 원하는 식재료 등을 입력하면 AI가 최적의 메뉴를 추천해 드립니다. 추천 결과는 사용자의 취향에 따라 점점 더 정확해집니다.',
  },
  {
    question: '북마크한 메뉴는 어디서 확인하나요?',
    answer: '마이페이지 > 북마크에서 저장한 메뉴를 모두 확인할 수 있습니다.',
  },
  {
    question: '회원 탈퇴는 어떻게 하나요?',
    answer: '마이페이지 > 계정 정보 > 탈퇴하기에서 진행할 수 있습니다. 탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다.',
  },
  {
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면의 "비밀번호 찾기"를 통해 가입 시 사용한 이메일로 재설정 링크를 받을 수 있습니다.',
  },
  {
    question: '커뮤니티 게시물은 어떻게 작성하나요?',
    answer: '하단 네비게이션의 커뮤니티 탭에서 우측 하단 작성 버튼을 눌러 투표 게시물을 작성할 수 있습니다.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/mypage" title="사용가이드 FAQ" />

      <div className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-start justify-between px-6 py-5 text-left"
              >
                <div className="flex gap-3 flex-1">
                  <span className="text-[#3CDCBA] font-bold text-sm mt-0.5">Q</span>
                  <span className="text-sm text-gray-800 font-medium flex-1">{faq.question}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 mt-0.5 ml-2 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 flex gap-3">
                  <span className="text-gray-400 font-bold text-sm mt-0.5">A</span>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer type="nav" />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';

const notices = [
  {
    id: 1,
    title: '메추라기 서비스 오픈 안내',
    date: '2025.01.01',
    content:
      '안녕하세요, 메추라기팀입니다.\n\n오늘부터 메추라기 서비스가 정식 오픈되었습니다. AI 메뉴 추천과 커뮤니티 기능을 자유롭게 이용해 주세요.\n\n앞으로도 더 좋은 서비스로 보답하겠습니다. 감사합니다.',
  },
  {
    id: 2,
    title: '커뮤니티 이용 규칙 안내',
    date: '2025.01.05',
    content:
      '커뮤니티를 건강하게 유지하기 위해 아래 규칙을 꼭 지켜주세요.\n\n1. 타인을 비방하거나 불쾌감을 주는 게시물은 삭제될 수 있습니다.\n2. 광고성 게시물 작성은 금지됩니다.\n3. 반복적인 규칙 위반 시 이용이 제한될 수 있습니다.',
  },
  {
    id: 3,
    title: 'AI 추천 기능 업데이트 안내',
    date: '2025.02.10',
    content:
      'AI 메뉴 추천 기능이 업데이트되었습니다.\n\n이번 업데이트에서는 사용자의 최근 선택 이력을 반영하여 더욱 정확한 추천을 제공합니다. 날씨 데이터 연동도 개선되어 더 세밀한 추천이 가능해졌습니다.',
  },
];

export default function NoticePage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/mypage" title="공지사항" />

      <div className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {[...notices].reverse().map(notice => (
            <div key={notice.id}>
              <button
                onClick={() => toggle(notice.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{notice.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{notice.date}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 ml-3 shrink-0 transition-transform duration-200 ${
                    openId === notice.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openId === notice.id && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
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

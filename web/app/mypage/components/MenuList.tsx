'use client';

import { useRouter } from 'next/navigation';

export default function MenuList() {
  const router = useRouter();

  const menuItems = [
    { label: '내 게시물', path: '/mypage/posts' },
    { label: '북마크', path: '/mypage/bookmarks' },
    { label: '계정 정보', path: '/mypage/account' },
    { label: '알림 설정', path: '/mypage/notifications' },
    { label: '사용가이드 FAQ', path: '/mypage/faq' },
    { label: '공지사항', path: '/mypage/notice' },
  ];

  return (
    <div className="py-4">
      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base text-gray-800">{item.label}</span>
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
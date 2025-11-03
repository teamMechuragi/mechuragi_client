'use client';

import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';

export default function AccountPage() {
  const router = useRouter();
  const { user } = useUser(); // 👈 setUser 제거

  // 👇 handleLogout 함수 삭제

  const accountMenuItems = [
    { 
      label: '이메일', 
      value: user?.email || '로그인이 필요합니다',
      path: null 
    },
    { label: '비밀번호 변경', path: '/mypage/account/pwchange' },
    { 
      label: '로그아웃', 
      path: '/mypage/account/logout' // 👈 path 추가, action 삭제
    },
    { label: '회원 탈퇴', path: '/mypage/account/withdrawal' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <Header title="계정 정보" backLink="/mypage" />

      {/* Menu Items */}
      <div className="py-4">
        {accountMenuItems.map((item, index) => (
          <div key={index}>
            {item.path ? ( // 👈 item.action 제거
              <button
                onClick={() => router.push(item.path!)} // 👈 단순화
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base text-gray-800">{item.label}</span>
                <Image 
                  src="/icon/arrow-right.png" 
                  alt="화살표" 
                  width={20} 
                  height={20}
                  className="text-gray-400"
                />
              </button>
            ) : (
              <div className="flex items-center justify-between px-6 py-5">
                <span className="text-base text-gray-800">{item.label}</span>
                <span className="text-base text-gray-500">{item.value}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <Footer type="nav" />
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = () => {
    // 로그아웃 처리
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 로그인 페이지로 이동
    router.replace('/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleCancel}
      />
      
      {/* 모달 컨테이너 - 모바일 최적화 */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] px-6 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-sm mx-auto p-6 shadow-xl pointer-events-auto transform">
          <h2 className="text-lg font-bold text-center mb-8">
            로그아웃 하시겠습니까?
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-full font-bold active:bg-gray-400 transition-all"
            >
              취소
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 bg-[#3CDCBA] text-white rounded-full font-bold active:bg-[#2CBCA0] transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
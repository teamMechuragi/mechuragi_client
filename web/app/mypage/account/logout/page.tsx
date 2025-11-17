'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);

    try {
      // ✅ 추가: 백엔드 로그아웃 API 호출
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        const response = await fetch('http://15.165.136.100:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        // 204 No Content는 response.ok가 true
        if (response.ok) {
          console.log('서버 로그아웃 성공');
        } else {
          console.warn('서버 로그아웃 실패, 로컬 로그아웃 진행');
        }
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
      // 에러가 나도 로컬 로그아웃은 진행
    } finally {
      // ✅ 로컬 데이터 삭제 (기존 코드)
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // 로그인 페이지로 이동
      router.replace('/login');
    }
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
              disabled={isLoggingOut}
              className={`flex-1 py-3 bg-gray-300 text-gray-700 rounded-full font-bold transition-all ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'active:bg-gray-400'
              }`}
            >
              취소
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex-1 py-3 bg-[#3CDCBA] text-white rounded-full font-bold transition-all ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'active:bg-[#2CBCA0]'
              }`}
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
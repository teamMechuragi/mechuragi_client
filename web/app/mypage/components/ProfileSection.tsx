'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ToggleItem from './ToggleItem';
import { useUser } from '@/app/context/UserContext';
import { useState, useEffect } from 'react';

export default function ProfileSection() {
  const router = useRouter();
  const { user } = useUser();
  const [detailSettings, setDetailSettings] = useState<any[]>([]);

  useEffect(() => {
    // ========== 임시 방법: localStorage에서 가져오기 (서버 없을 때) ==========
    const stored = localStorage.getItem("detailSettings");
    if (stored) {
      const data = JSON.parse(stored);
      
      // 설정이 있으면 토글 목록 생성
      const settings = [];
      if (data.nickname) {
        settings.push({ 
          label: data.nickname, 
          defaultChecked: true
        });
      }
      
      setDetailSettings(settings);
    }
    // ========== 임시 방법 끝 ==========

    // ========== 실제 서버 연결 시 사용할 코드 ==========
    // const fetchDetailSettings = async () => {
    //   try {
    //     const token = localStorage.getItem("accessToken");
    //     if (!token) {
    //       // 로그인 안 되어있으면 빈 상태로 유지
    //       return;
    //     }
    //
    //     // 서버에서 로그인한 사용자의 상세정보 가져오기
    //     const response = await fetch("http://13.125.127.106/api/user/detail-settings", {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //
    //     if (!response.ok) {
    //       throw new Error("상세정보 조회 실패");
    //     }
    //
    //     const data = await response.json();
    //     
    //     // 설정이 있으면 토글 목록 생성
    //     const settings = [];
    //     if (data.preferenceName) {
    //       settings.push({ 
    //         label: data.preferenceName, // 백엔드는 preferenceName 사용
    //         defaultChecked: true
    //       });
    //     }
    //     
    //     setDetailSettings(settings);
    //     
    //     // localStorage에도 저장 (빠른 로딩용)
    //     localStorage.setItem("detailSettings", JSON.stringify(data));
    //     
    //   } catch (error) {
    //     console.error("상세정보 조회 실패:", error);
    //     // 에러 시 localStorage에 저장된 정보라도 표시
    //     const stored = localStorage.getItem("detailSettings");
    //     if (stored) {
    //       const data = JSON.parse(stored);
    //       const settings = [];
    //       if (data.nickname || data.preferenceName) {
    //         settings.push({ 
    //           label: data.nickname || data.preferenceName, 
    //           defaultChecked: true
    //         });
    //       }
    //       setDetailSettings(settings);
    //     }
    //   }
    // };
    //
    // fetchDetailSettings();
    // ========== 실제 서버 연결 코드 끝 ==========
  }, []);

  return (
    <>
      {/* 헤더 영역 */}
      <div className="px-6 pt-6 pb-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className="w-16 h-16 bg-[#3CDCBA] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image 
                src={user?.profileImage || "/profile/default-profile.png"} 
                alt="프로필" 
                width={64} 
                height={64}
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-base font-bold mb-0.5">{user?.username || '아이디'}</h2>
              <p className="text-xs text-gray-500">{user?.email || 'asdfg1234@naver.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push('/mypage/profile')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium whitespace-nowrap hover:bg-gray-50"
          >
            프로필 설정
          </button>
        </div>

        {/* 상세정보 설정 */}
        <div className="mt-6">
          <h3 className="text-base font-bold mb-3">상세정보 설정</h3>
          <div className="space-y-1">
            {detailSettings.length > 0 ? (
              detailSettings.map((setting, index) => (
                <ToggleItem 
                  key={index}
                  label={setting.label} 
                  defaultChecked={setting.defaultChecked}
                  onClick={() => router.push('/settings/details?from=mypage')}
                />
              ))
            ) : (
              <button
                onClick={() => router.push('/settings/details?from=mypage')}
                className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
              >
                상세정보를 추가해보세요
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-2 bg-gray-50"></div>
    </>
  );
}
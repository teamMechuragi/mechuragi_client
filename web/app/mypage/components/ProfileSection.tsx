'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ToggleItem from './ToggleItem';
import { useUser } from '@/app/context/UserContext';
import { useState, useEffect } from 'react';

export default function ProfileSection() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [detailSettings, setDetailSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ 사용자 정보 조회
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(userStr);
      const memberId = currentUser.id;

      // ✅ 회원 정보 조회 API 호출
      const response = await fetch(
        `https://mechuragi.kro.kr/api/members/${memberId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("사용자 정보 조회 실패");
      }

      const data = await response.json();
      
      // ✅ 사용자 정보 업데이트
      const userData = {
        id: data.id,
        username: data.nickname,
        email: data.email,
        profileImage: data.profileImageUrl,
        emailVerified: data.emailVerified,
        provider: data.provider,
        role: data.role,
        status: data.status,
      };
      
      // Context와 localStorage 업데이트
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // 상세정보 설정 처리 (나중에 백엔드 API 추가되면 수정)
      loadDetailSettings();
      
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      // 에러 발생 시 localStorage의 정보라도 사용
      loadDetailSettings();
    } finally {
      setLoading(false);
    }
  };

  // 상세정보 설정 로드 (임시 - localStorage)
  const loadDetailSettings = () => {
    const stored = localStorage.getItem("detailSettings");
    if (stored) {
      const data = JSON.parse(stored);
      const settings = [];
      
      if (data.nickname) {
        settings.push({ 
          label: data.nickname, 
          defaultChecked: true
        });
      }
      
      setDetailSettings(settings);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pt-6 pb-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

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
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-base font-bold mb-0.5">{user?.username || '아이디'}</h2>
              <p className="text-xs text-gray-500">{user?.email || 'email@example.com'}</p>
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
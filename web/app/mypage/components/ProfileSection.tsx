"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ToggleItem from './ToggleItem';
import { useUser } from '@/app/context/UserContext';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

export default function ProfileSection() {
  const router = useRouter();
  const { user, setUser, preferences, refreshPreferences } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 사용자 정보 및 입맛 리스트 초기 로드
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

      // 1. 회원 정보 상세 조회 (최신 닉네임/이미지 반영)
      const userRes = await fetch(`${API_URL}/api/members/${memberId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (userRes.ok) {
        const data = await userRes.json();
        const userData = {
          id: data.id,
          username: data.nickname,
          email: data.email,
          profileImage: data.profileImageUrl,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // 2. Context를 통해 입맛 리스트 새로고침
      await refreshPreferences();

    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ [API 연결] 활성화 토글 (라디오 버튼처럼 하나만 활성화하거나 개별 토글)
  const handleToggle = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("로그인이 필요합니다.");

      const response = await fetch(`${API_URL}/api/preferences/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("활성화 상태 변경 실패");

      // 서버 반영 후 Context 데이터 갱신
      await refreshPreferences();
    } catch (error) {
      console.error(error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="p-6 bg-white animate-pulse text-gray-400 font-medium">데이터를 불러오는 중...</div>;
  }

  return (
    <>
      <div className="px-6 pt-6 pb-6 bg-white">
        {/* 프로필 영역 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-[#F7F8F9] rounded-full overflow-hidden flex-shrink-0 relative border border-gray-100">
              <Image 
                src={user?.profileImage || "/profile/default-profile.png"} 
                alt="프로필" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-black text-[#1A1A1A] mb-0.5">{user?.username || '사용자'}</h2>
              <p className="text-xs text-gray-400 font-medium">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/mypage/profile')}
            className="px-3 py-2 bg-[#F7F8F9] text-[#1A1A1A] rounded-xl text-[12px] font-bold"
          >
            프로필 설정
          </button>
        </div>

        {/* 입맛 관리 영역 */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-black text-[#1A1A1A]">나의 입맛 관리</h3>
            <button
              onClick={() => router.push('/settings/details/new')}
              className="px-3 py-1.5 text-[#3CDCBA] text-[12px] font-bold bg-[#EFFFFB] rounded-lg transition-colors"
            >
              + 추가하기
            </button>
          </div>

          <div className="space-y-3">
            {preferences && preferences.length > 0 ? (
              preferences.map((pref) => (
                <ToggleItem 
                  key={pref.id}
                  id={pref.id.toString()}
                  label={pref.preferenceName} 
                  isChecked={pref.isActive}
                  onToggle={() => handleToggle(pref.id)}
                  // 수정 페이지로 이동할 때 id를 포함한 경로로 이동
                  onEdit={(id) => router.push(`/settings/details/${id}`)}
                />
              ))
            ) : (
              <button
                onClick={() => router.push('/settings/details/new')}
                className="w-full py-10 bg-[#F7F8F9] rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-2xl">😋</span>
                <p className="text-sm text-gray-400 font-bold text-center">
                  아직 등록된 입맛이 없어요.<br/>
                  상세 정보를 추가하고 추천받아보세요!
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="h-2 bg-gray-50"></div>
    </>
  );
}
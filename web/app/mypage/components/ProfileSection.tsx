'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ToggleItem from './ToggleItem';
import { useUser } from '@/app/context/UserContext';
import { useState, useEffect } from 'react';
import { getMember } from '@/app/api/memberApi';
import { activatePreference } from '@/app/api/preferenceApi';

export default function ProfileSection() {
  const router = useRouter();
  const { user, setUser, preferences, refreshPreferences } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 사용자 정보 조회
  const fetchUserProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');

      if (!userStr) {
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(userStr);
      const memberId = currentUser.id;

      // API를 통한 회원 정보 조회
      const data = await getMember(memberId);

      // 사용자 정보 업데이트
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

    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 상세정보 활성화 토글
  const handleToggleActive = async (preferenceId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // API를 통한 선호도 활성화 토글
      await activatePreference(preferenceId);

      // Context의 preferences 새로고침
      await refreshPreferences();

    } catch (error) {
      console.error("활성화 변경 실패:", error);
      alert("활성화 변경에 실패했습니다.");
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">상세정보 설정</h3>
            <button
              onClick={() => router.push('/settings/details?from=mypage')}
              className="px-3 py-1 text-xs text-[#00D9A0] border border-[#00D9A0] rounded-lg hover:bg-[#00D9A0] hover:text-white transition-colors"
            >
              + 추가
            </button>
          </div>
          <div className="space-y-2">
            {preferences.length > 0 ? (
              preferences.map((preference) => (
                <div
                  key={preference.id}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* 라디오 버튼 */}
                  <input
                    type="radio"
                    name="activePreference"
                    checked={preference.isActive}
                    onChange={() => handleToggleActive(preference.id)}
                    className="w-4 h-4 text-[#00D9A0] focus:ring-[#00D9A0] cursor-pointer"
                  />
                  {/* 별칭 (클릭 시 수정 페이지로 이동) */}
                  <button
                    onClick={() => {
                      const token = localStorage.getItem('accessToken');
                      console.log('[ProfileSection] 수정 버튼 클릭:', {
                        preferenceId: preference.id,
                        preferenceName: preference.preferenceName,
                        hasToken: !!token,
                        tokenLength: token ? token.length : 0
                      });
                      router.push(`/settings/details/edit?id=${preference.id}&from=mypage`);
                    }}
                    className="flex-1 text-left text-sm font-medium text-gray-700"
                  >
                    {preference.preferenceName}
                  </button>
                </div>
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

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import { useState, useEffect } from 'react';
import { getMyInfo } from '@/app/api/memberApi';

export default function ProfileSection() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getMyInfo();
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
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      localStorage.clear();
      setUser(null);
      router.push('/login');
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
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-6 bg-white">
      <div className="flex items-center justify-between">
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

        {/* 우측 버튼 영역 (Action 모음) */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => router.push('/mypage/profile')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium whitespace-nowrap hover:bg-gray-50"
          >
            프로필 설정
          </button>
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
            >
              로그아웃
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
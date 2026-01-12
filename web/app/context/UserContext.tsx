"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  emailVerified?: boolean;
  provider?: string;
  role?: string;
  status?: string;
}

export interface PreferenceItem {
  id: number;
  preferenceName: string;
  isActive: boolean;
}

export interface PreferenceDetail {
  id: number;
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo: string | null;
  isOnDiet: string;
  veganOption: string;
  spiceLevel: string;
  preferredFoodTypes: string[];
  preferredTastes: string[];
  dislikedFoods: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  preferences: PreferenceItem[];
  activePreference: PreferenceItem | null;
  activePreferenceDetail: PreferenceDetail | null;
  refreshUser: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [activePreferenceDetail, setActivePreferenceDetail] = useState<PreferenceDetail | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 활성화된 preference 계산
  const activePreference = preferences.find(p => p.isActive) || null;

  // Preferences 조회 함수
  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr';
      const response = await fetch(
        `${apiUrl}/api/preferences`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("상세정보 조회 실패");
      }

      const data: PreferenceItem[] = await response.json();
      setPreferences(data);

      // localStorage에도 저장 (오프라인 대비)
      localStorage.setItem("preferences", JSON.stringify(data));

      // 활성화된 preference의 상세정보 조회
      const activeItem = data.find(p => p.isActive);
      if (activeItem) {
        const detailResponse = await fetch(
          `${apiUrl}/api/preferences/${activeItem.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (detailResponse.ok) {
          const detailData: PreferenceDetail = await detailResponse.json();
          setActivePreferenceDetail(detailData);
          localStorage.setItem("activePreferenceDetail", JSON.stringify(detailData));
        }
      } else {
        setActivePreferenceDetail(null);
        localStorage.removeItem("activePreferenceDetail");
      }

    } catch (error) {
      console.error("상세정보 조회 실패:", error);

      // 에러 시 localStorage에서 가져오기
      const storedPreferences = localStorage.getItem("preferences");
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }

      const storedActiveDetail = localStorage.getItem("activePreferenceDetail");
      if (storedActiveDetail) {
        setActivePreferenceDetail(JSON.parse(storedActiveDetail));
      }
    }
  };

  // 사용자 정보 조회 함수
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        // 토큰이 없으면 localStorage에서 가져오기 (오프라인용)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        return;
      }

      // localStorage에서 memberId 가져오기
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        return;
      }

      const currentUser = JSON.parse(storedUser);
      const memberId = currentUser.id;

      if (!memberId) {
        console.error("memberId가 없습니다.");
        return;
      }

      // ✅ 수정: 올바른 엔드포인트로 사용자 정보 조회
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr/api';
      const response = await fetch(
        `${apiUrl}/members/${memberId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // 401 에러면 토큰 만료 → 로그아웃 처리
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }
        throw new Error("사용자 정보 조회 실패");
      }

      const data = await response.json();

      // ✅ API 명세서 응답 구조에 맞게 매핑
      const userData: User = {
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

      // 사용자 정보와 함께 preferences도 조회
      await fetchPreferences();

    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);

      // 에러 시 localStorage의 정보라도 사용
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // preferences도 localStorage에서 로드
      const storedPreferences = localStorage.getItem("preferences");
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }

      // activePreferenceDetail도 localStorage에서 로드
      const storedActiveDetail = localStorage.getItem("activePreferenceDetail");
      if (storedActiveDetail) {
        setActivePreferenceDetail(JSON.parse(storedActiveDetail));
      }
    }
  };

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const initUser = async () => {
      await fetchUserProfile();
      setIsInitialized(true);
    };

    initUser();
  }, []);

  // refreshUser 함수 추가 (다른 컴포넌트에서 호출 가능)
  const refreshUser = async () => {
    await fetchUserProfile();
  };

  // refreshPreferences 함수 추가 (preference 변경 시 호출)
  const refreshPreferences = async () => {
    await fetchPreferences();
  };

  // 초기화 로딩 화면
  if (!isInitialized) {
    return (
      <UserContext.Provider value={{
        user,
        setUser,
        preferences,
        activePreference,
        activePreferenceDetail,
        refreshUser,
        refreshPreferences
      }}>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#3CDCBA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">로딩 중...</p>
          </div>
        </div>
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      preferences,
      activePreference,
      activePreferenceDetail,
      refreshUser,
      refreshPreferences
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
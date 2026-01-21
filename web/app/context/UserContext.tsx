"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { getMyInfo } from "@/app/api/memberApi";
import { getPreferences, getPreference } from "@/app/api/preferenceApi";

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
  const isInitializing = useRef(false); // React Strict Mode 중복 실행 방지

  // 활성화된 preference 계산
  const activePreference = preferences.find(p => p.isActive) || null;

  // Preferences 조회 함수
  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      // API로 preferences 조회
      const data = await getPreferences();
      setPreferences(data);

      // localStorage에도 저장 (오프라인 대비)
      localStorage.setItem("preferences", JSON.stringify(data));

      // 활성화된 preference의 상세정보 조회
      const activeItem = data.find(p => p.isActive);
      if (activeItem) {
        const detailData = await getPreference(activeItem.id);
        setActivePreferenceDetail(detailData);
        localStorage.setItem("activePreferenceDetail", JSON.stringify(detailData));
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
        // 토큰이 없으면 localStorage에서만 가져오기 (로그인 전)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        return;
      }

      // API 호출로 최신 사용자 정보 조회
      const data = await getMyInfo();

      // 사용자 정보 매핑
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
    // React Strict Mode 중복 실행 방지
    if (isInitializing.current) return;
    isInitializing.current = true;

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
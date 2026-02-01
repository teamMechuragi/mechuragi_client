"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/app/common/Footer";

// 타입 정의 (기존 api 파일에서 가져오거나 정의)
interface Preference {
  id: number;
  preferenceName: string;
  numberOfDiners: number;
  spiceLevel: string;
  veganOption: string;
  isActive: boolean; // 토글 상태
}

export default function DetailsListClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  useEffect(() => {
    // ✅ [BACKEND API 연결 지점]
    const fetchList = async () => {
      try {
        setLoading(true);
        // [확인용] 빈 화면 테스트를 위해 빈 배열로 설정
        const data: Preference[] = []; 
        setPreferences(data); 
      } catch (error) {
        console.error("목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  // ✅ [토글 핸들러 수정]
  const handleToggle = async (id: number) => {
    // 1. UI 업데이트: 정렬 없이 제자리에서 isActive 상태만 변경
    setPreferences(prev => prev.map(p => ({
      ...p,
      isActive: p.id === id ? !p.isActive : false // 하나만 켜지도록 처리
    })));

    // 2. ✅ [BACKEND API 연결 지점]
    try {
      // await togglePreferenceStatus(id);
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
      <div className="w-full max-w-md mx-auto sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-50">
        <Header title="상세정보 설정" backLink="/Home" />
      </div>

      <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-24">
        <div className="mb-8">
          <h2 className="text-[20px] font-black text-[#1A1A1A] mb-2">나의 입맛 페르소나</h2>
          {/* ✅ 리스트가 있을 때만 설명 문구 노출 */}
          {preferences.length > 0 && (
            <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
              상황에 맞는 입맛을 켜주세요. <br />
              AI가 활성화된 정보를 바탕으로 추천해 드립니다.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {preferences.length > 0 ? (
              preferences.map((pref) => (
                <motion.div
                  key={pref.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    borderColor: pref.isActive ? "#3CDCBA" : "#F9FAFB",
                    backgroundColor: pref.isActive ? "#F0FFFB" : "#FFFFFF"
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="p-5 rounded-[24px] shadow-sm flex items-center justify-between border active:scale-[0.98] transition-all"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/settings/details/edit?id=${pref.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-[16px] text-[#1A1A1A]">{pref.preferenceName}</h4>
                      {pref.isActive && (
                        <span className="px-2 py-0.5 bg-[#EFFFFB] text-[#3CDCBA] text-[10px] font-bold rounded-md">사용중</span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {pref.numberOfDiners}인용 · {pref.spiceLevel} · {pref.veganOption}
                    </p>
                  </div>

                  {/* 토글 버튼 */}
                  <button
                    onClick={() => handleToggle(pref.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      pref.isActive ? "bg-[#3CDCBA]" : "bg-gray-200"
                    }`}
                  >
                    <motion.div
                      animate={{ x: pref.isActive ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </motion.div>
              ))
            ) : (
              // ✅빈 화면 디자인
              !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-16 text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                    <span className="text-4xl">🍳</span>
                  </div>
                  <h3 className="text-[#1A1A1A] font-bold text-[18px] mb-2">아직 입맛이 비어있어요</h3>
                  <p className="text-gray-400 text-[14px] font-medium leading-relaxed">
                    나만의 첫 번째 페르소나를 만들고<br />
                    딱 맞는 메뉴 추천을 받아보세요!
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* ✅ 점선을 없애고 깔끔한 화이트 카드로 바꾼 추가 버튼 */}
          <button
            onClick={() => router.push("/settings/details/new")}
            className="w-full py-5 bg-white border border-gray-100 rounded-[24px] text-[#1A1A1A] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <span className="text-[#3CDCBA] text-xl">+</span>
            <span>새로운 입맛 추가하기</span>
          </button>
        </div>
      </main>

      <Footer 
        type="button" 
        buttonText="설정 완료" 
        onButtonClick={() => router.push("/Home")} 
      />
    </div>
  );
}
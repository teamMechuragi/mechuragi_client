"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; 
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { useLoading } from "@/app/context/LoadingContext";
import { getTimeRecommendation } from "@/app/api/recommendApi";

export default function TimePage() {
  const router = useRouter();
  const { activePreferenceDetail } = useUser();
  const { startLoading, stopLoading } = useLoading();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    { value: "아침", label: "아침", icon: "🌅", timeRange: "07:00 ~ 10:30" },
    { value: "점심", label: "점심", icon: "☀️", timeRange: "11:30 ~ 14:00" },
    { value: "저녁", label: "저녁", icon: "🌆", timeRange: "17:30 ~ 20:30" },
    { value: "야식", label: "야식", icon: "🌙", timeRange: "22:00 ~ 02:00" },
  ];

  const handleComplete = async () => {
    if (loading || !selectedTime) return;

    if (!activePreferenceDetail) {
      alert("활성화된 취향이 없습니다. 취향을 먼저 등록해주세요.");
      return;
    }

    setLoading(true);
    startLoading('AI');

    try {
      const data = await getTimeRecommendation({
        mealTime: selectedTime,
        numberOfDiners: activePreferenceDetail.numberOfDiners,
        dietStatus: activePreferenceDetail.dietStatus,
        veganOption: activePreferenceDetail.veganOption,
        spiceLevel: activePreferenceDetail.spiceLevel,
        foodTypes: activePreferenceDetail.preferredFoodTypes,
        tastes: activePreferenceDetail.preferredTastes,
        avoidedFoods: activePreferenceDetail.avoidedFoods,
        allergies: activePreferenceDetail.allergies,
      });

      router.push(`/menu-select/result?data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("추천을 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <div className="w-full max-w-sm mx-auto bg-white">
        <Header title="시간대 추천" backLink="/Home" />
      </div>

      <main className="w-full max-w-sm mx-auto px-6 pb-32 flex-1 pt-14">
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            지금은 <span className="text-[#00D9A0]">어떤 식사</span>를<br />
            하실 시간인가요?
          </h2>
          <p className="text-gray-400 text-sm mt-2">원하시는 시간대를 선택해 주세요.</p>
        </div>

        <div className="flex flex-col gap-4">
          {timeOptions.map((option) => {
            const isSelected = selectedTime === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedTime(option.value)}
                className={`group relative w-full p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                  isSelected
                    ? "bg-[#00D9A0] text-white shadow-xl shadow-green-100 translate-x-2"
                    : "bg-white text-gray-600 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`text-3xl transition-transform duration-300 ${isSelected ? 'scale-125 rotate-6' : 'group-hover:scale-110'}`}>
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-lg font-bold leading-none ${isSelected ? "text-white" : "text-gray-800"}`}>
                      {option.label}
                    </p>
                    <p className={`text-xs mt-1.5 font-medium ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                      {option.timeRange}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "bg-white border-white" : "border-gray-200 bg-gray-50"
                  }`}>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D9A0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 안내 문구 (선택 안했을 때 노출) */}
        {!selectedTime && (
          <p className="text-center text-gray-300 text-sm mt-12 animate-pulse">
            항목을 하나 선택하면 완료 버튼이 활성화됩니다.
          </p>
        )}
      </main>

      {/* 🌟 활성화된 입맛 배지 표시 🌟 */}
      {activePreferenceDetail && selectedTime !== "" && (
        <div className="fixed bottom-[104px] left-0 right-0 flex justify-center z-50 pointer-events-none px-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1A1A1A]/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 pointer-events-auto border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#3CDCBA] rounded-full animate-pulse" />
              <p className="text-[11px] font-bold">
                <span className="text-[#3CDCBA]">'{activePreferenceDetail.preferenceName}'</span> 입맛 반영 중
              </p>
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <span className="text-[9px] font-black text-gray-400 uppercase">AI Filter</span>
          </motion.div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer
          type="button"
          buttonText={loading ? "맛있는 메뉴 찾는 중..." : "추천 시작하기"}
          onButtonClick={handleComplete}
          disabled={!selectedTime || loading}
        />
      </div>
    </div>
  );
}
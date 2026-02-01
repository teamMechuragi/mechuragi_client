"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; 
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { getFeelingRecommendation } from "@/app/api/recommendApi";

export default function MoodPage() {
  const router = useRouter();
  const { activePreferenceDetail } = useUser();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const moodOptions = [
    { value: "행복해요", label: "최고예요!", icon: "😊", color: "#FFD240", message: "기분이 좋아서 맛있는 음식 먹고 싶어" },
    { value: "슬퍼요", label: "슬퍼요", icon: "😢", color: "#4A90E2", message: "기분이 우울해서 위로되는 음식 먹고 싶어" },
    { value: "화나요", label: "화나요", icon: "😠", color: "#FF5C5C", message: "화가 나서 스트레스 풀릴 음식 먹고 싶어" },
    { value: "피곤해요", label: "피곤해요", icon: "😴", color: "#8E94A5", message: "피곤해서 기력 회복될 음식 먹고 싶어" },
    { value: "스트레스", label: "스트레스", icon: "😰", color: "#A55EEA", message: "스트레스 받아서 기분 전환될 음식 먹고 싶어" },
    { value: "설레요", label: "설레요", icon: "🤗", color: "#FF8AD8", message: "설레고 신나서 특별한 음식 먹고 싶어" },
  ];

  // 화면에 보여줄 때만 자연스럽게 변환하는 함수
  const getNaturalMoodText = (mood: string) => {
    switch (mood) {
      case "행복해요": return "행복한";
      case "슬퍼요": return "슬픈";
      case "화나요": return "화난";
      case "피곤해요": return "피곤한";
      case "스트레스": return "스트레스 받는";
      case "설레요": return "설레는";
      default: return mood;
    }
  };

  const handleComplete = async () => {
    if (loading || !selectedMood) return;
    const selectedOption = moodOptions.find((option) => option.value === selectedMood);
    if (!selectedOption || !activePreferenceDetail) {
      if (!activePreferenceDetail) alert("활성화된 취향이 없습니다. 취향을 먼저 등록해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await getFeelingRecommendation({
        feeling: selectedOption.message,
        dietStatus: activePreferenceDetail.isOnDiet,
        veganOption: activePreferenceDetail.veganOption,
        spiceLevel: activePreferenceDetail.spiceLevel,
        foodTypes: activePreferenceDetail.preferredFoodTypes,
        tastes: activePreferenceDetail.preferredTastes,
        dislikedFoods: activePreferenceDetail.dislikedFoods,
      });
      router.push(`/menu-select/result?data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("추천을 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="기분 추천" backLink="/Home" />
      </div>

      <main className="w-full max-w-sm mx-auto px-8 pb-24 flex-1 pt-14">
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black text-gray-900 leading-tight"
          >
            오늘 기분은 어떠세요?
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedMood}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-[15px] font-bold text-[#00D9A0] min-h-[1.5rem]"
            >
              {selectedMood 
                ? `${getNaturalMoodText(selectedMood)} 마음을 위한 메뉴를 준비할게요` 
                : "당신의 감정을 터치해주세요"}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-y-12 gap-x-4 place-items-center">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className="flex flex-col items-center outline-none"
            >
              <div className="relative">
                <motion.div
                  animate={selectedMood === option.value ? {
                    scale: [1, 1.15, 1.1],
                    borderRadius: ["38%", "50%", "45%", "38%"],
                  } : {
                    scale: 1,
                    borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                    y: [0, -6, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-20 h-20 flex items-center justify-center text-4xl shadow-inner transition-colors duration-500 ${
                    selectedMood === option.value ? "shadow-lg ring-4 ring-gray-900 ring-offset-2" : "shadow-none"
                  }`}
                  style={{ backgroundColor: option.color }}
                >
                  <motion.span
                    animate={selectedMood === option.value ? { scale: 1.2, rotate: [0, -10, 10, 0] } : {}}
                  >
                    {option.icon}
                  </motion.span>
                </motion.div>
                
                <AnimatePresence>
                  {selectedMood === option.value && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-black/10 blur-[2px] rounded-full"
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <span className={`text-[13px] font-bold mt-5 transition-all ${
                selectedMood === option.value ? "text-black scale-105" : "text-gray-300"
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      <Footer
        type="button"
        buttonText={loading ? "추천 받는 중..." : "감정을 위한 메뉴 추천받기"}
        onButtonClick={handleComplete}
        disabled={!selectedMood || loading}
      />
    </div>
  );
}
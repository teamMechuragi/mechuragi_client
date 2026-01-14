"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    { value: "행복해요", label: "행복해요", icon: "😊", message: "기분이 좋아서 맛있는 음식 먹고 싶어" },
    { value: "슬퍼요", label: "슬퍼요", icon: "😢", message: "기분이 우울해서 위로되는 음식 먹고 싶어" },
    { value: "화나요", label: "화나요", icon: "😠", message: "화가 나서 스트레스 풀릴 음식 먹고 싶어" },
    { value: "피곤해요", label: "피곤해요", icon: "😴", message: "피곤해서 기력 회복될 음식 먹고 싶어" },
    { value: "스트레스", label: "스트레스", icon: "😰", message: "스트레스 받아서 기분 전환될 음식 먹고 싶어" },
    { value: "설레요", label: "설레요", icon: "🤗", message: "설레고 신나서 특별한 음식 먹고 싶어" },
  ];

  const handleComplete = async () => {
    if (loading || !selectedMood) return;

    const selectedOption = moodOptions.find((option) => option.value === selectedMood);
    if (!selectedOption) return;

    // 활성화된 취향 확인
    if (!activePreferenceDetail) {
      alert("활성화된 취향이 없습니다. 취향을 먼저 등록해주세요.");
      return;
    }

    setLoading(true);
    try {
      // API로 추천 요청
      const data = await getFeelingRecommendation({
        feeling: selectedOption.message,
        dietStatus: activePreferenceDetail.isOnDiet,
        veganOption: activePreferenceDetail.veganOption,
        spiceLevel: activePreferenceDetail.spiceLevel,
        foodTypes: activePreferenceDetail.preferredFoodTypes,
        tastes: activePreferenceDetail.preferredTastes,
        dislikedFoods: activePreferenceDetail.dislikedFoods,
      });

      // 추천 결과 페이지로 이동
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

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <h2 className="text-2xl font-bold mb-8">오늘 기분은 어떠세요?</h2>

        <div className="grid grid-cols-2 gap-4">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                selectedMood === option.value
                  ? "bg-[#00D9A0] text-white shadow-lg scale-105"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-4xl">{option.icon}</span>
              <span className="text-base font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer
        type="button"
        buttonText={loading ? "추천 받는 중..." : "완료"}
        onButtonClick={handleComplete}
        disabled={!selectedMood || loading}
      />
    </div>
  );
}
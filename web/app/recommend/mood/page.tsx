"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

export default function MoodRecommendPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: "happy", label: "행복", emoji: "😊" },
    { id: "excited", label: "흥분", emoji: "🤩" },
    { id: "calm", label: "평온", emoji: "😌" },
    { id: "tired", label: "피곤", emoji: "😴" },
    { id: "stressed", label: "스트레스", emoji: "😫" },
    { id: "sad", label: "슬픔", emoji: "😢" },
  ];

  const handleComplete = () => {
    if (selectedDate && selectedMood) {
      // API 호출 또는 추천 페이지로 이동
      router.push(`/recommend/mood/result?date=${selectedDate}&mood=${selectedMood}`);
    }
  };

  const isFormValid = selectedDate !== null && selectedMood !== null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="오늘의 날씨는 어떤가요?" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1">
        {/* 날짜 선택 */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl">🗓️</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[12, 21].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`py-3 rounded-full font-bold transition-all ${
                  selectedDate === date
                    ? "bg-[#3CDCBA] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {date}일
              </button>
            ))}
          </div>
        </div>

        {/* 기분 선택 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">오늘의 기분은?</h3>
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`py-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${
                  selectedMood === mood.id
                    ? "bg-[#3CDCBA] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer
        type="button"
        buttonText="완료"
        onButtonClick={handleComplete}
        disabled={!isFormValid}
      />
    </div>
  );
}
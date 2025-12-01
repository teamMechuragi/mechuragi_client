"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

export default function TimePage() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    { value: "아침", label: "아침", icon: "🌅" },
    { value: "점심", label: "점심", icon: "☀️" },
    { value: "저녁", label: "저녁", icon: "🌆" },
    { value: "야식", label: "야식", icon: "🌙" },
  ];

  const handleComplete = async () => {
    if (loading || !selectedTime) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai-recommendations/time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          timeOfDay: selectedTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 추천 결과 페이지로 이동
        router.push(`/recommend/result?data=${encodeURIComponent(JSON.stringify(data))}`);
      } else {
        alert("추천을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="시간대 추천" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <h2 className="text-2xl font-bold mb-8">언제 드실 건가요?</h2>

        <div className="grid grid-cols-2 gap-4">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTime(option.value)}
              className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                selectedTime === option.value
                  ? "bg-[#00D9A0] text-white shadow-lg scale-105"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-4xl">{option.icon}</span>
              <span className="text-lg font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer
        type="button"
        buttonText={loading ? "추천 받는 중..." : "완료"}
        onButtonClick={handleComplete}
        disabled={!selectedTime || loading}
      />
    </div>
  );
}
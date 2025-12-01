"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

export default function WeatherPage() {
  const router = useRouter();
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const weatherOptions = [
    { value: "맑음", label: "맑음" },
    { value: "흐림", label: "흐림" },
    { value: "비", label: "비" },
    { value: "눈", label: "눈" },
  ];

  const temperatureOptions = [
    { value: "춥다", label: "춥다" },
    { value: "적당", label: "적당" },
    { value: "더움", label: "더움" },
  ];

  const humidityOptions = [
    { value: "건조함", label: "건조함" },
    { value: "습함", label: "습함" },
    { value: "찜통", label: "찜통" },
  ];

  const toggleOption = (value: string) => {
    setSelectedWeather((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleComplete = async () => {
    if (loading || selectedWeather.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai-recommendations/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          weatherConditions: selectedWeather,
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
        <Header title="날씨 추천" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <h2 className="text-2xl font-bold mb-8">오늘의 날씨는 어떤가요?</h2>

        {/* 날씨 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">날씨</h3>
          <div className="flex flex-wrap gap-2">
            {weatherOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedWeather.includes(option.value)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 온도 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">온도</h3>
          <div className="flex flex-wrap gap-2">
            {temperatureOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedWeather.includes(option.value)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 습도 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">습도</h3>
          <div className="flex flex-wrap gap-2">
            {humidityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedWeather.includes(option.value)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer
        type="button"
        buttonText={loading ? "추천 받는 중..." : "완료"}
        onButtonClick={handleComplete}
        disabled={selectedWeather.length === 0 || loading}
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import Image from "next/image";

export default function WeatherRecommendPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);

  const dates = [12, 21];
  
  const weathers = [
    { id: "sunny", label: "맑음", icon: "☀️" },
    { id: "cloudy", label: "흐림", icon: "☁️" },
    { id: "rainy", label: "비", icon: "🌧️" },
    { id: "snowy", label: "눈", icon: "❄️" },
  ];

  const handleComplete = () => {
    if (selectedDate && selectedWeather) {
      // API 호출 또는 추천 페이지로 이동
      router.push(`/recommend/weather/result?date=${selectedDate}&weather=${selectedWeather}`);
    }
  };

  const isFormValid = selectedDate !== null && selectedWeather !== null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="오늘의 날씨는 어떤가요?" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1">
        {/* 날짜 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-2xl font-bold">12월</span>
          </div>
          
          {/* 날짜 선택 버튼들 */}
          <div className="flex justify-center gap-4 mb-8">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`w-16 h-16 rounded-full font-bold text-lg transition-all ${
                  selectedDate === date
                    ? "bg-[#3CDCBA] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {date}
              </button>
            ))}
          </div>

          {/* 날짜 라벨 */}
          <div className="flex justify-center gap-4">
            <span className="w-16 text-center text-sm text-gray-500">월요일</span>
            <span className="w-16 text-center text-sm text-gray-500">금요일</span>
          </div>
        </div>

        {/* 날씨 선택 */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-center">날씨</h3>
          <div className="grid grid-cols-4 gap-3">
            {weathers.map((weather) => (
              <button
                key={weather.id}
                onClick={() => setSelectedWeather(weather.id)}
                className={`py-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${
                  selectedWeather === weather.id
                    ? "bg-[#3CDCBA] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-3xl">{weather.icon}</span>
                <span className="text-xs">{weather.label}</span>
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
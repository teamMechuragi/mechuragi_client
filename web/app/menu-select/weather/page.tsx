"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { getWeatherRecommendation } from "@/app/api/recommendApi";

// 날씨 옵션에 이모지 추가
const WEATHER_OPTIONS = [
  { value: "맑음", label: "맑음", icon: "☀️" },
  { value: "흐림", label: "흐림", icon: "☁️" },
  { value: "비", label: "비", icon: "☔" },
  { value: "눈", label: "눈", icon: "❄️" },
];

const TEMP_OPTIONS = [
  { value: "춥다", label: "춥다", icon: "🥶" },
  { value: "적당", label: "적당", icon: "🌡️" },
  { value: "더움", label: "더움", icon: "🔥" },
];

const HUMIDITY_OPTIONS = [
  { value: "건조함", label: "건조함", icon: "🌵" },
  { value: "습함", label: "습함", icon: "💦" },
  { value: "찜통", label: "찜통", icon: "♨️" },
];

export default function WeatherPage() {
  const router = useRouter();
  const { activePreferenceDetail } = useUser();
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleOption = (value: string) => {
    setSelectedWeather((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // 자동 날씨 추천 로직 (실제 서비스 시에는 날씨 API 결과에 따라 매핑)
  const handleAutoDetect = () => {
    // 예시: 현재 날씨가 '비'고 '적당'하며 '습함'일 때
    const detected = ["비", "적당", "습함"];
    setSelectedWeather(detected);
  };

  const handleComplete = async () => {
    if (loading || selectedWeather.length === 0) return;
    if (!activePreferenceDetail) {
      alert("활성화된 취향이 없습니다. 취향을 먼저 등록해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await getWeatherRecommendation({
        weatherConditions: selectedWeather,
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white shadow-sm">
        <Header title="오늘의 분위기" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 pt-14">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold leading-tight">
            지금 밖은 <br />
            <span className="text-[#00D9A0]">어떤 느낌</span>인가요?
          </h2>
          <button 
            onClick={handleAutoDetect}
            className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1"
          >
            📍 현재 날씨로 선택
          </button>
        </div>

        {/* 섹션: 날씨 */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">현재 하늘 상태</h3>
          <div className="grid grid-cols-4 gap-3">
            {WEATHER_OPTIONS.map((opt) => (
              <SelectionButton
                key={opt.value}
                option={opt}
                isSelected={selectedWeather.includes(opt.value)}
                onClick={() => toggleOption(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* 섹션: 온도 */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">느껴지는 체온</h3>
          <div className="grid grid-cols-3 gap-3">
            {TEMP_OPTIONS.map((opt) => (
              <SelectionButton
                key={opt.value}
                option={opt}
                isSelected={selectedWeather.includes(opt.value)}
                onClick={() => toggleOption(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* 섹션: 습도 */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">습도 분위기</h3>
          <div className="grid grid-cols-3 gap-3">
            {HUMIDITY_OPTIONS.map((opt) => (
              <SelectionButton
                key={opt.value}
                option={opt}
                isSelected={selectedWeather.includes(opt.value)}
                onClick={() => toggleOption(opt.value)}
              />
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-gray-400 mt-4">
          선택한 날씨에 맞춰 최적의 메뉴를 추천해 드릴게요!
        </p>
      </div>

      <Footer
        type="button"
        buttonText={loading ? "추천 메뉴 구성 중..." : "결과 확인하기"}
        onButtonClick={handleComplete}
        disabled={selectedWeather.length === 0 || loading}
      />
    </div>
  );
}

// 재사용 가능한 선택 버튼 컴포넌트
function SelectionButton({ option, isSelected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-200 border-2 ${
        isSelected
          ? "bg-white border-[#00D9A0] shadow-md transform scale-105"
          : "bg-white border-transparent text-gray-500 hover:border-gray-200"
      }`}
    >
      <span className="text-2xl mb-2">{option.icon}</span>
      <span className={`text-xs font-bold ${isSelected ? "text-[#00D9A0]" : "text-gray-600"}`}>
        {option.label}
      </span>
    </button>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

// 양념 데이터를 등급별로 분류
const SEASONING_CATEGORIES = {
  essential: {
    title: "기본 양념 (이건 거의 필수!)",
    items: [
      { id: "salt", name: "소금", icon: "🧂" },
      { id: "sugar", name: "설탕", icon: "🍬" },
      { id: "soy", name: "간장", icon: "🍶" },
      { id: "pepper", name: "후추", icon: "🧂" },
      { id: "oil", name: "식용유", icon: "🧪" },
      { id: "garlic", name: "다진마늘", icon: "🧄" },
    ]
  },
  extra: {
    title: "있으면 요리가 풍성해져요",
    items: [
      { id: "gochu", name: "고추장", icon: "🌶️" },
      { id: "doen", name: "된장", icon: "🍲" },
      { id: "oyster", name: "굴소스", icon: "🦪" },
      { id: "mayo", name: "마요네즈", icon: "🥚" },
      { id: "ketchup", name: "케첩", icon: "🍅" },
      { id: "mirim", name: "미림/맛술", icon: "🍷" },
    ]
  }
};

export default function SeasoningPage() {
  const router = useRouter();
  const [mySeasonings, setMySeasonings] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("my_seasonings");
    if (saved) setMySeasonings(JSON.parse(saved));
  }, []);

  const toggleSeasoning = (name: string) => {
    const updated = mySeasonings.includes(name)
      ? mySeasonings.filter((s) => s !== name)
      : [...mySeasonings, name];
    setMySeasonings(updated);
  };

  const handleSave = () => {
    localStorage.setItem("my_seasonings", JSON.stringify(mySeasonings));
    router.back(); // 저장 후 재료 선택 페이지로 이동
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="보유 양념 관리" backLink="/recommend/ingredients" />
      
      <div className="flex-1 px-6 pt-14 pb-32 max-w-md mx-auto w-full">
        <h2 className="text-[20px] font-black mb-1.5">어떤 양념이 준비됐나요?</h2>
        <p className="text-[13px] text-gray-400 font-medium mb-10">보유하신 양념에 맞춰 AI가 레시피를 조정합니다.</p>

        {/* 필수 양념 섹션 */}
        <section className="mb-10">
          <h3 className="text-[14px] font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
            ⭐ {SEASONING_CATEGORIES.essential.title}
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            {SEASONING_CATEGORIES.essential.items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleSeasoning(item.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  mySeasonings.includes(item.name) 
                    ? "border-[#3CDCBA] bg-[#EFFFFC] text-[#1A1A1A]" 
                    : "border-gray-50 bg-[#F7F8F9] text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[12px] font-bold">{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 있으면 좋은 양념 섹션 */}
        <section>
          <h3 className="text-[14px] font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
            ✨ {SEASONING_CATEGORIES.extra.title}
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            {SEASONING_CATEGORIES.extra.items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleSeasoning(item.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  mySeasonings.includes(item.name) 
                    ? "border-[#3CDCBA] bg-[#EFFFFC] text-[#1A1A1A]" 
                    : "border-gray-50 bg-[#F7F8F9] text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[12px] font-bold">{item.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Footer type="button" buttonText="양념 정보 저장" onButtonClick={handleSave} />
    </div>
  );
}
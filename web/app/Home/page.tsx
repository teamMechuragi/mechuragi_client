"use client";

import { useEffect, useState } from "react";
import PopularMenuList from "./components/PopularMenuList";
import AiRecommendationGrid from "./components/AiRecommendationGrid";
import { motion } from "framer-motion";
import { useUser } from "@/app/context/UserContext";

export default function HomePage() {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState({ top: "", bottom: "" });

  useEffect(() => {
    const hour = new Date().getHours();
    
    // 시간대별 문구 설정 (쉼표 제거 및 줄바꿈 구조)
    if (hour < 11) {
      setGreeting({ top: "상쾌한 아침이에요", bottom: "든든하게 시작해볼까요?" });
    } else if (hour < 14) {
      setGreeting({ top: "벌써 점심시간이네요", bottom: "오늘 점심 메뉴는요?" });
    } else if (hour < 17) {
      setGreeting({ top: "나른한 오후네요", bottom: "가벼운 간식 어떠세요?" });
    } else if (hour < 21) {
      setGreeting({ top: "오늘 하루 고생 많았어요", bottom: "저녁 식사는요?" });
    } else {
      setGreeting({ top: "깊어가는 밤이네요", bottom: "야식이 생각나지 않으세요?" });
    }

    const now = new Date();
    setCurrentTime(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-5 bg-white max-w-sm mx-auto pb-12">
      
      {/* 1. 개인화 헤더 */}
      <header className="mt-4 mb-7">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[12px] font-bold text-[#3CDCBA] mb-2 uppercase tracking-wider">
            Today's Recommendation
          </p>
          <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-[1.35] tracking-tight">
            <span className="text-[#3CDCBA]">{user?.username || '회원'}</span>님 <br />
            {greeting.top} <br />
            {greeting.bottom}
          </h1>
        </motion.div>

        {/* 2. 대시보드 카드 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 p-5 rounded-[24px] bg-[#F8F9FA] border border-gray-50 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#3CDCBA]/5 rounded-full" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-bold mb-0.5">서울 날씨</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[18px]">🌦️</span>
                <span className="text-[14px] font-bold text-[#1A1A1A]">흐림, 2°C</span>
              </div>
            </div>
            
            <div className="h-7 w-[1px] bg-gray-200" />
            
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-gray-400 font-bold mb-0.5">추천 키워드</span>
              <span className="text-[14px] font-extrabold text-[#3CDCBA]">#따뜻한_국물</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 3. 오늘 핫한 메뉴 섹션 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">오늘 핫한 메뉴</h2>
            <div className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-[11px] font-bold text-gray-300">{currentTime} Update</span>
        </div>
        <PopularMenuList />
      </section>

      {/* 4. 맞춤형 AI 추천 섹션 */}
      <section>
        <div className="mb-5">
          <h2 className="text-[18px] font-bold text-[#1A1A1A]">맞춤형 AI 추천</h2>
          <p className="text-[12px] text-gray-400 mt-0.5 font-medium">취향을 분석해 메뉴를 제안해요</p>
        </div>
        <AiRecommendationGrid />
      </section>

    </div>
  );
}
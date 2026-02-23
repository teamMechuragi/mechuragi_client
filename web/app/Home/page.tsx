"use client";

import { useEffect, useState } from "react";
import PopularMenuList from "./components/PopularMenuList";
import AiRecommendationGrid from "./components/AiRecommendationGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/app/context/UserContext";

const BANNER_MESSAGES = [
  { id: 1, emoji: "🥗", text: "맛있게 먹으면 0칼로리!\n오늘도 행복한 식사 하세요.", sub: "건강한 마음이 제일 중요해요" },
  { id: 2, emoji: "🍗", text: "치킨은 살 안 쪄요.\n살은 메추라기가 가져갈께요.", sub: "단백질만 얻어가세요" },
  { id: 3, emoji: "💧", text: "식사 전 물 한 잔은\n보약보다 좋다는 사실!", sub: "지금 바로 한 모금 어때요?" },
  { id: 4, emoji: "🍚", text: "한국인은 밥심!\n오늘도 든든하게 챙겨 드세요.", sub: "끼니 거르지 마세요" },
  { id: 5, emoji: "🏃", text: "배불리 먹었다면\n10분만 가볍게 산책해볼까요?", sub: "소화도 잘 되고 기분도 좋아져요" },
  { id: 6, emoji: "🥦", text: "채소 한 입, 고기 한 입!\n영양 밸런스를 맞춰보세요.", sub: "몸이 고마워할 거예요" },
  { id: 7, emoji: "🍱", text: "오늘의 메뉴 선택이 고민될 땐\n밑에 AI 추천을 믿어보세요!", sub: "결정 장애 해결사" },
  { id: 8, emoji: "🍎", text: "아침에 먹는 사과는 금!\n상쾌한 하루를 시작하세요.", sub: "비타민 충전 시간" },
  { id: 9, emoji: "😴", text: "잠들기 3시간 전에는\n위장을 쉬게 해주는 게 좋아요.", sub: "꿀잠을 위한 작은 습관" },
  { id: 10, emoji: "🌈", text: "다양한 색깔의 음식을 먹으면\n더 건강해진다는 사실!", sub: "식탁을 화려하게 채워보세요" },
];

export default function HomePage() {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState({ top: "", bottom: "" });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
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

    const timer = setInterval(() => {
      moveBanner(1);
    }, 7000); // 7초로 더 느리게 조절

    return () => clearInterval(timer);
  }, [currentBanner]);

  const moveBanner = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentBanner((prev) => (prev + 1) % BANNER_MESSAGES.length);
    } else {
      setCurrentBanner((prev) => (prev - 1 + BANNER_MESSAGES.length) % BANNER_MESSAGES.length);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

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

        {/* 2. 대시보드 카드 -> 가독성 개선된 슬라이딩 배너 */}
        <div className="mt-6 relative h-[140px] w-full">
          {/* 배너 메인 영역 */}
          <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#F8F9FA] border border-gray-50 shadow-sm">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentBanner}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                className="absolute inset-0 flex items-center justify-between px-10" // 좌우 패딩을 10으로 늘려 화살표 공간 확보
              >
                <div className="flex flex-col z-10 flex-1">
                  <span className="text-[10px] text-[#3CDCBA] font-extrabold mb-1 px-2 py-0.5 bg-white rounded-full w-fit">Food TMI</span>
                  <p className="text-[14px] font-bold text-[#1A1A1A] leading-tight whitespace-pre-line mt-1">
                    {BANNER_MESSAGES[currentBanner].text}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-1 font-medium">
                    {BANNER_MESSAGES[currentBanner].sub}
                  </span>
                </div>
                <div className="text-[40px] select-none ml-2">
                  {BANNER_MESSAGES[currentBanner].emoji}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 화살표 버튼: 배경과 분리된 투명 버튼으로 가독성 방해 최소화 */}
            <button 
              onClick={() => moveBanner(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-full flex items-center justify-center text-gray-300 hover:text-[#3CDCBA] transition-colors"
            >
              <span className="text-[20px] font-light">❮</span>
            </button>
            <button 
              onClick={() => moveBanner(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-full flex items-center justify-center text-gray-300 hover:text-[#3CDCBA] transition-colors"
            >
              <span className="text-[20px] font-light">❯</span>
            </button>
          </div>
          
          {/* 하단 중앙 인디케이터 (배너 높이에 포함되지 않게 살짝 띄움) */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {BANNER_MESSAGES.map((_, index) => (
              <div 
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentBanner ? "w-4 bg-[#3CDCBA]" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 3. 오늘 핫한 메뉴 섹션 */}
      <section className="mt-4 mb-10"> {/* 배너 하단 여백 때문에 mt-4 추가 */}
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
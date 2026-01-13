"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

type Card = {
  title: string;
  description: string;
  bg: string;
  image?: string;
  link?: string;
};

export default function AiRecommendationGrid() {
  const router = useRouter();

  const cards: Card[] = [
    { title: "상세정보 설정", description: "알레르기 여부, 선호 음식 등 상세정보 설정하기", bg: "#F2F2F4", link: "/settings/details/new" },
    { title: "재료", description: "냉장고 속 재료로 메뉴 추천받기", bg: "#DAFFB7", image: "/icon/ingre.png", link: "/menu-select/ingredients" },
    { title: "기분", description: "오늘의 기분으로 메뉴 추천받기", bg: "#FFFFB5", image: "/icon/feel.png", link: "/menu-select/mood" },
    { title: "날씨", description: "오늘의 날씨로 메뉴 추천받기", bg: "#C0EBFF", image: "/icon/weather.png", link: "/menu-select/weather" },
    { title: "시간대", description: "현재 시간대로 메뉴 추천받기", bg: "#FFEAF5", image: "/icon/time.png", link: "/menu-select/time" },
    { title: "AI 대화", description: "AI 대화를 통해 메뉴 추천받기", bg: "#DCE8FF", image: "/icon/talk.png", link: "/menu-select/Aichat" },
  ];

  // 전체 리스트 등장 애니메이션
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  // 카드 전체가 하나의 유닛으로 움직임
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 25 } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3"
    >
      {cards.map((card, idx) => (
        <motion.button
          key={idx}
          variants={cardVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }} // 카드 전체가 위로 슥
          whileTap={{ scale: 0.96 }} // 누를 때 전체가 꾹
          onClick={() => card.link && router.push(card.link)}
          style={{ backgroundColor: card.bg }}
          className="group relative w-full h-[150px] rounded-[28px] p-5 flex flex-col justify-start overflow-hidden text-left border border-black/[0.02] shadow-sm hover:shadow-md transition-shadow"
        >
          {/* 텍스트 영역: 고정 (산만함 제거) */}
          <div className="z-10 relative">
            <h3 className="font-bold text-[19px] mb-1 text-[#1A1A1A] tracking-tight">
              {card.title}
            </h3>
            <p className="font-medium text-[12px] text-[#777777] leading-[1.4] break-keep pr-4">
              {card.description}
            </p>
          </div>

          {/* 아이콘: 카드 구석에 안정적으로 배치 */}
          {card.image && (
            <div className="absolute right-1 bottom-1">
              <Image
                src={card.image}
                alt={card.title}
                width={card.title === "날씨" ? 75 : 85}
                height={card.title === "날씨" ? 58 : 65}
                className="object-contain drop-shadow-sm"
              />
            </div>
          )}

          {/* 은은한 광택 효과만 추가 (고급스러움) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.button>
      ))}
    </motion.div>
  );
}
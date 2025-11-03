"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Card = {
  title: string;
  description: string;
  bg: string;
  image?: string;
  link?: string; // 링크 추가
};

export default function AiRecommendationGrid() {
  const router = useRouter();

  const cards: Card[] = [
    {
      title: "상세정보 설정",
      description: "알레르기 여부, 선호 음식 등 상세정보 설정하기",
      bg: "#F2F2F4",
      link: "/settings/details", // 상세정보 설정 페이지 경로
    },
    {
      title: "재료",
      description: "냉장고 속 재료로 추천받기",
      bg: "#DAFFB7",
      image: "/icon/ingre.png",
      link: "/recommend/ingredients",
    },
    {
      title: "기분",
      description: "오늘의 기분으로 추천받기",
      bg: "#FFFFB5",
      image: "/icon/feel.png",
      link: "/recommend/mood",
    },
    {
      title: "날씨",
      description: "오늘의 날씨로 추천받기",
      bg: "#C0EBFF",
      image: "/icon/weather.png",
      link: "/recommend/weather",
    },
    {
      title: "시간대",
      description: "현재 시간대로 추천받기",
      bg: "#FFEAF5",
      image: "/icon/time.png",
      link: "/recommend/time",
    },
    {
      title: "AI 대화",
      description: "AI 대화를 통해 추천받기",
      bg: "#DCE8FF",
      image: "/icon/talk.png",
      link: "/recommend/ai-chat",
    },
  ];

  const handleCardClick = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card, idx) => (
        <button
          key={idx}
          onClick={() => handleCardClick(card.link)}
          style={{ backgroundColor: card.bg }}
          className="w-[172px] h-[132px] rounded-[20px] p-4 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity"
        >
          {/* 제목 + 설명 */}
          <div className="text-left">
            <h3 className="font-bold text-[20px] mb-1 text-black">{card.title}</h3>
            <p className="font-medium text-[12px] text-[#777777]">{card.description}</p>
          </div>

          {/* 이미지 (카드 하단 가운데 정렬, 고정 높이 유지) */}
          <div className="mt-auto ml-auto mb-[3px] mr-[-6px]">
            {card.image && (
              <Image
                src={card.image}
                alt={card.title}
                width={card.title === "날씨" ? 68 : 80}
                height={card.title === "날씨" ? 54 : 60}
                className="object-contain"
              />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
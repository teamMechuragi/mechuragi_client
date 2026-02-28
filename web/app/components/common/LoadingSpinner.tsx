'use client';

import Image from 'next/image';

// 상황별 타입을 정의합니다.
type LoadingType = 'AI' | 'TASTE' | 'DEFAULT';

interface LoadingSpinnerProps {
  type: LoadingType;
}

export default function LoadingSpinner({ type }: LoadingSpinnerProps) {
  // 상황별 설정(문구, 아이콘)을 매핑합니다.
  const config = {
    AI: {
      message: "AI가 취향을 분석 중이에요...",
      icons: ["🤖", "✨", "🔍"], // 여러 아이콘이 지나가는 효과
    },
    TASTE: {
      message: "입맛 정보를 소중히 저장 중이에요...",
      icons: ["🥗", "🍲", "😋"],
    },
    DEFAULT: {
      message: "잠시만 기다려주세요...",
      icons: [], // 로고 회전 사용
    }
  };

  const { message, icons } = config[type];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      {/* 1. 로고 회전 모드 (DEFAULT) */}
      {type === 'DEFAULT' ? (
        <div className="animate-spin mb-4">
          <Image src="\public\loginLogo.png" alt="Loading" width={60} height={60} />
        </div>
      ) : (
        /* 2. 아이콘 지나가는 모드 (AI, TASTE) */
        <div className="flex gap-4 mb-4">
          {icons.map((icon, index) => (
            <span 
              key={index} 
              className="text-4xl animate-bounce" 
              style={{ animationDelay: `${index * 0.2}s` }} // 순차적으로 튀어오름
            >
              {icon}
            </span>
          ))}
        </div>
      )}

      {/* 공통 텍스트 */}
      <p className="text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  );
}
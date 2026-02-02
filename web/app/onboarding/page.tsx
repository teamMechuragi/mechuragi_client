'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;

const onboardingContent = [
  {
    cardImage: `${CLOUDFRONT_DOMAIN}/images/onboarding/1-card.png`,
    subtitle: 'AI SMART CURATION',
    title: '나보다 내 취향을 더 잘 아는\n스마트한 AI 메뉴 추천',
    themeColor: '#3CDCBA',
  },
  {
    cardImage: `${CLOUDFRONT_DOMAIN}/images/onboarding/2-card.png`,
    subtitle: 'DAILY FOOD LOG',
    title: '나만의 맛있는 일상을\n차곡차곡 기록해 보세요',
    themeColor: '#FF9E2C',
  },
  {
    cardImage: `${CLOUDFRONT_DOMAIN}/images/onboarding/3-card.png`,
    subtitle: 'COMMUNITY VOTE',
    title: '고민될 땐 망설이지 말고\n함께 투표로 결정하기',
    themeColor: '#00BCD4',
  },
  {
    cardImage: `${CLOUDFRONT_DOMAIN}/images/onboarding/4-card.png`,
    subtitle: 'PERSONALIZED',
    title: '더 정교한 상세 설정으로\n완벽한 메뉴 추천을 경험하세요',
    themeColor: '#AB47BC',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingContent.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('hasVisited', 'true');
      router.push('/login');
    }
  };

  const current = onboardingContent[currentSlide];

  return (
    /**
     * [수정 핵심]
     * 1. 최외곽의 flex items-center, min-h-[100dvh], max-w-[430px]를 모두 삭제했습니다.
     * 2. 이제 ClientLayout이 제공하는 규격(h-full, w-full) 안에서 컨텐츠만 흐릅니다.
     */
    <div className="relative flex flex-col w-full h-full bg-white">
      
      {/* 배경: 오로라 효과 (부모 div가 relative이므로 absolute로 잘 붙습니다) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[10%] left-[-10%] w-[120%] h-[50%] rounded-full blur-[100px] opacity-[0.12] transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: current.themeColor }}
        />
      </div>

      {/* 상단바: 인디케이터와 Skip 버튼 (여백 pt-12로 최적화) */}
      <div className="relative flex items-center justify-between px-7 pt-12 shrink-0 z-30">
        <div className="flex gap-1.5 p-1 rounded-full">
          {onboardingContent.map((_, i) => (
            <div 
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8' : 'w-2 bg-gray-200'
              }`}
              style={{ backgroundColor: i === currentSlide ? current.themeColor : undefined }}
            />
          ))}
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="text-gray-400 text-[14px] font-bold hover:text-gray-600 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* 메인 슬라이드 영역 */}
      <div className="relative flex-1 z-10 overflow-hidden min-h-[400px]">
        <div 
          className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {onboardingContent.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 flex flex-col pt-10">
              
              {/* 텍스트 영역 */}
              <div className="px-9 shrink-0">
                <p className="text-[11px] font-black tracking-[0.25em] mb-3" style={{ color: item.themeColor }}>
                  {item.subtitle}
                </p>
                <h1 className="text-[26px] font-black text-[#1a1a1a] leading-[1.3] tracking-[-0.04em] whitespace-pre-line">
                  {item.title}
                </h1>
              </div>

              {/* 이미지 영역: 하단 여유 공간 확보를 위해 top-[40px]로 상향 */}
              <div className="relative flex-1 w-full mt-4">
                <div className="absolute inset-x-0 top-[40px] bottom-0 flex justify-center items-start">
                  <div className="relative w-full h-[110%] transform-gpu scale-105">
                    <div className="absolute inset-x-0 bottom-0 h-[30%] z-20 pointer-events-none bg-gradient-to-t from-white via-white/60 to-transparent" />
                    <Image
                      src={item.cardImage}
                      alt="onboarding"
                      fill
                      className="object-contain object-top"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 버튼: pb-10으로 버튼 위치 안정화 */}
      <div className="relative z-40 px-6 pb-10 bg-white shrink-0">
        <button
          onClick={handleNext}
          className="w-full h-[60px] rounded-[22px] text-white font-bold text-[17px] transition-all active:scale-[0.97] duration-200"
          style={{ 
            backgroundColor: current.themeColor,
            boxShadow: `0 10px 25px -10px ${current.themeColor}aa`
          }}
        >
          {currentSlide === onboardingContent.length - 1 ? '시작하기' : '다음'}
        </button>
      </div>
      
    </div>
  );
}
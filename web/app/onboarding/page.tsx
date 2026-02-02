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

  // 이전 슬라이드로 이동하는 함수 추가
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const current = onboardingContent[currentSlide];

  return (
    <div className="relative flex flex-col w-full h-full bg-white">
      
      {/* 배경: 오로라 효과 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[10%] left-[-10%] w-[120%] h-[50%] rounded-full blur-[100px] opacity-[0.12] transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: current.themeColor }}
        />
      </div>

      {/* 상단바: 좌(이전) / 중(인디케이터) / 우(Skip) */}
      <div className="relative flex items-center justify-between px-6 pt-8 shrink-0 z-30">
        {/* 좌측 영역: 이전 버튼 */}
        <div className="w-10 flex justify-start">
          {currentSlide > 0 && (
            <button 
              onClick={handlePrev}
              className="p-1 -ml-1 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
        </div>

        {/* 중앙 영역: 인디케이터 */}
        <div className="flex gap-1.5">
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

        {/* 우측 영역: Skip 버튼 */}
        <div className="w-10 flex justify-end">
          <button 
            onClick={() => router.push('/login')} 
            className="text-gray-400 text-[14px] font-bold hover:text-gray-600 transition-colors whitespace-nowrap"
          >
            Skip
          </button>
        </div>
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

              {/* 이미지 영역 */}
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

      {/* 푸터 버튼 */}
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
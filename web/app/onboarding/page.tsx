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
    <div className="flex justify-center items-center w-full min-h-[100dvh] bg-[#f8f9fa]">
      <div className="relative flex flex-col w-full max-w-[430px] h-[100dvh] bg-white overflow-hidden shadow-2xl">
        
        {/* 배경: 색상만 부드럽게 전환 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="absolute -top-[10%] left-[-10%] w-[120%] h-[50%] rounded-full blur-[100px] opacity-[0.12] transition-colors duration-700 ease-in-out"
            style={{ backgroundColor: current.themeColor }}
          />
        </div>

        {/* 상단바: 고정 */}
        <div className="relative flex items-center justify-between px-7 pt-16 shrink-0 z-30">
          <div className="flex gap-1.5 p-1 rounded-full">
            {onboardingContent.map((_, i) => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === currentSlide ? 'w-8 bg-gray-900' : 'w-2 bg-gray-200'
                }`}
                style={{ backgroundColor: i === currentSlide ? current.themeColor : undefined }}
              />
            ))}
          </div>
          <button onClick={() => router.push('/login')} className="text-gray-400 text-[14px] font-bold">Skip</button>
        </div>

        {/* 메인 슬라이드 영역: 텍스트와 이미지가 한 몸으로 이동 */}
        <div className="relative flex-1 z-10 overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {onboardingContent.map((item, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 flex flex-col pt-12">
                
                {/* 텍스트 영역: 개별 애니메이션 제거 후 슬라이드에 동기화 */}
                <div className="px-9 shrink-0">
                  <p className="text-[12px] font-black tracking-[0.25em] mb-4" style={{ color: item.themeColor }}>
                    {item.subtitle}
                  </p>
                  <h1 className="text-[30px] font-black text-[#1a1a1a] leading-[1.3] tracking-[-0.04em] whitespace-pre-line">
                    {item.title}
                  </h1>
                </div>

                {/* 이미지 영역: top-[90px] 고정, 부가적인 딜레이/트랜지션 삭제 */}
                <div className="relative flex-1 w-full mt-4">
                  <div className="absolute inset-x-0 top-[90px] h-full flex justify-center items-start">
                    {/* transform-gpu로 하드웨어 가속만 활성화하여 밀림 현상 방지 */}
                    <div className="relative w-full h-[120%] transform-gpu scale-110">
                      <div className="absolute inset-x-0 bottom-0 h-[50%] z-20 pointer-events-none bg-gradient-to-t from-white via-white/70 to-transparent" />
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
        <div className="relative z-40 px-6 pb-12 bg-white">
          <button
            onClick={handleNext}
            className="w-full h-[64px] rounded-[22px] text-white font-bold text-[17px] transition-all active:scale-[0.97] duration-200"
            style={{ 
              backgroundColor: current.themeColor,
              boxShadow: `0 12px 30px -10px ${current.themeColor}77`
            }}
          >
            {currentSlide === onboardingContent.length - 1 ? '시작하기' : '다음'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
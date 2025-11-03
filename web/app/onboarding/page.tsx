'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../common/Header';
import Footer from '../common/Footer';

const onboardingContent = [
  {
    cardImage: '/images/onboarding/1-card.png',
    subtitle: '오늘 뭘 먹지 고민될 때?',
    title: 'AI 메뉴추천',
  },
  {
    cardImage: '/images/onboarding/2-card.png',
    subtitle: '오늘의 식사 기록',
    title: '먹방 일기 캘린더',
  },
  {
    cardImage: '/images/onboarding/3-card.png',
    subtitle: '먹고싶은게 너무 많아 메뉴 고르기 어려울 땐',
    title: '커뮤니티 투표',
  },
  {
    cardImage: '/images/onboarding/4-card.png',
    subtitle: '상세정보 설정으로',
    title: '내 취향에 맞는 메뉴\n추천받기',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  // 슬라이드 변경 시 애니메이션 키 업데이트
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < onboardingContent.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('hasVisited', 'true');
      router.push('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasVisited', 'true');
    router.push('/login');
  };

  const current = onboardingContent[currentSlide];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white flex flex-col">
      {/* 헤더 - Progress Dots 포함 */}
      <Header 
        isOnboarding={true}
        onSkip={handleSkip}
        showPrev={currentSlide > 0}
        onPrev={handlePrev}
        currentSlide={currentSlide}
        totalSlides={onboardingContent.length}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-6 pb-24 pt-12 justify-center">
        {/* 텍스트 영역 - 애니메이션 없음 */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-3">
            {current.subtitle}
          </p>
          <h1 className="text-3xl font-bold whitespace-pre-line">
            {current.title}
          </h1>
        </div>

        {/* 중앙 카드 이미지 - 올라오는 애니메이션만 */}
        <div className="flex items-center justify-center">
          <div 
            key={`card-${animationKey}`}
            className="relative w-full max-w-[296px] animate-slide-up"
          >
            <Image
              src={current.cardImage}
              alt="feature card"
              width={592}
              height={1282}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <Footer 
        type="button"
        buttonText={currentSlide === onboardingContent.length - 1 ? '취향 설정하러' : '다음'}
        onButtonClick={handleNext}
      />
    </div>
  );
}
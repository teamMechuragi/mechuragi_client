"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { bookmarkLatestSession } from "@/app/api/bookmarkApi";

interface FoodRecommendation {
  name: string;
  description: string;
  reason: string;
  ingredients: string;
  cookingTime: string;
  difficulty: string;
}

function RecommendResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error("데이터 파싱 실패:", error);
      }
    }
  }, [searchParams]);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComplete = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isBookmarked) {
        await bookmarkLatestSession();
      }

      router.push("/Home");
    } catch (error) {
      console.error("북마크 저장 실패:", error);
      router.push("/Home");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        {/* 커스텀 헤더 with 북마크 버튼 */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
          <div className="max-w-sm mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => router.push("/Home")} className="p-2 -ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-semibold text-lg">추천 결과</h1>
            <button
              onClick={handleBookmarkToggle}
              className="p-2 -mr-2"
            >
              <svg
                className="w-6 h-6"
                fill={isBookmarked ? "#00D9A0" : "none"}
                stroke={isBookmarked ? "#00D9A0" : "currentColor"}
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </header>
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-16">
        <h2 className="text-2xl font-bold mb-2">오늘의 추천 메뉴</h2>
        <p className="text-sm text-gray-500 mb-6">
          {isBookmarked ? "북마크에 저장됩니다" : "오른쪽 상단 아이콘을 눌러 저장하세요"}
        </p>

        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((food, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5"
              >
                <h3 className="text-lg font-bold text-[#00D9A0] mb-2">
                  {food.name}
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {food.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="leading-relaxed">{food.reason}</p>
                  <p className="pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">재료:</span> {food.ingredients}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700">
                      ⏱️ {food.cookingTime}
                    </span>
                    <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700">
                      👨‍🍳 난이도: {food.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              추천 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      <Footer
        type="button"
        buttonText={isSubmitting ? "저장 중..." : "완료"}
        onButtonClick={handleComplete}
      />
    </div>
  );
}

export default function RecommendResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white">
        <div className="w-full max-w-sm mx-auto">
          <Header title="추천 결과" backLink="/Home" />
        </div>
        <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
          <div className="text-center py-20 text-gray-400">
            로딩 중...
          </div>
        </div>
      </div>
    }>
      <RecommendResultContent />
    </Suspense>
  );
}

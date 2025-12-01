"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

interface FoodRecommendation {
  name: string;
  description: string;
  reason: string;
  ingredients: string;
  cookingTime: string;
  difficulty: string;
  bookmarked?: boolean;
}

export default function RecommendResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);

  useEffect(() => {
    // URL 파라미터에서 추천 결과 가져오기
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        if (data.recommendations) {
          setRecommendations(data.recommendations.map((food: FoodRecommendation) => ({
            ...food,
            bookmarked: false,
          })));
        }
      } catch (error) {
        console.error("데이터 파싱 실패:", error);
      }
    }
  }, [searchParams]);

  const toggleBookmark = (index: number) => {
    setRecommendations(prev => 
      prev.map((food, i) => 
        i === index ? { ...food, bookmarked: !food.bookmarked } : food
      )
    );
  };

  const handleComplete = () => {
    router.push("/"); // 홈으로 이동 (또는 원하는 페이지)
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="추천 결과" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <h2 className="text-2xl font-bold mb-6">오늘의 추천 메뉴를 소개할게요</h2>

        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((food, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5 relative"
              >
                {/* 북마크 버튼 */}
                <button
                  onClick={() => toggleBookmark(index)}
                  className="absolute top-5 right-5"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={food.bookmarked ? "#00D9A0" : "none"}
                    stroke={food.bookmarked ? "#00D9A0" : "#9CA3AF"}
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" />
                  </svg>
                </button>

                <h3 className="text-lg font-bold text-[#00D9A0] mb-2 pr-8">
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
        buttonText="완료"
        onButtonClick={handleComplete}
      />
    </div>
  );
}
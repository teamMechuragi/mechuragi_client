"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { bookmarkLatestSession } from "@/app/api/bookmarkApi";

interface FoodRecommendation {
  name: string;
  reason: string;
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
      if (isBookmarked) await bookmarkLatestSession();
      router.push("/Home");
    } catch (error) {
      console.error("저장 실패:", error);
      router.push("/Home");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-sm mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => router.push("/Home")} className="p-2 -ml-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-bold text-gray-900">결과 리포트</span>
          <button onClick={handleBookmarkToggle} className="p-2 -mr-2">
            <motion.div whileTap={{ scale: 0.8 }}>
              <svg className="w-7 h-7" fill={isBookmarked ? "#00D9A0" : "none"} stroke={isBookmarked ? "#00D9A0" : "#333"} strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </motion.div>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 pt-20 pb-28 px-5 max-w-sm mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="w-16 h-16 bg-[#00D9A0]/10 text-[#00D9A0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">메뉴 선정이 완료되었어요!</h2>
          <p className="text-gray-500 text-sm mt-2">오늘 당신의 취향에 딱 맞는 음식입니다.</p>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {recommendations.map((food, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#00D9A0] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">{food.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{food.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer
        type="button"
        buttonText={isSubmitting ? "저장 중..." : "확인했습니다"}
        onButtonClick={handleComplete}
      />
    </div>
  );
}

export default function RecommendResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#00D9A0] border-t-transparent rounded-full" />
        <p className="mt-4 text-gray-400 font-medium">AI가 메뉴를 분석 중입니다...</p>
      </div>
    }>
      <RecommendResultContent />
    </Suspense>
  );
}
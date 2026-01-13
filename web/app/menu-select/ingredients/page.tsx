"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext"; // 취향 데이터 사용
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

const CATEGORIZED_INGREDIENTS = {
  전체: ["감자", "양파", "당근", "대파", "마늘", "계란", "두부", "김치", "돼지고기", "소고기", "닭고기", "새우"],
  채소: ["감자", "양파", "당근", "대파", "마늘", "고추", "버섯", "애호박", "상추"],
  단백질: ["계란", "두부", "돼지고기", "소고기", "닭고기", "새우", "오징어", "고등어"],
  기타: ["김치", "치즈", "떡", "만두", "햄", "참치캔"]
};

export default function IngredientPage() {
  const router = useRouter();
  const { activePreferenceDetail } = useUser(); // Context에서 활성화된 상세 취향 가져오기
  const [activeTab, setActiveTab] = useState<keyof typeof CATEGORIZED_INGREDIENTS>("전체");
  const [inputValue, setInputValue] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<{name: string, isUrgent: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (selectedIngredients.some(item => item.name === trimmed)) return;
    setSelectedIngredients([...selectedIngredients, { name: trimmed, isUrgent: false }]);
    setInputValue("");
  };

  const handleRemoveIngredient = (name: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item.name !== name));
  };

  const toggleUrgent = (name: string) => {
    setSelectedIngredients(selectedIngredients.map(item => 
      item.name === name ? { ...item, isUrgent: !item.isUrgent } : item
    ));
    if (showGuide) setShowGuide(false);
  };

  const handleComplete = async () => {
    if (loading || selectedIngredients.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const urgentItems = selectedIngredients.filter(i => i.isUrgent).map(i => i.name);
      const normalItems = selectedIngredients.filter(i => !i.isUrgent).map(i => i.name);
      
      const mySeasonings = localStorage.getItem("my_seasonings") || "기본 양념 위주";

      // ✅ AI에게 보낼 데이터 구조 (취향 정보 상세 포함)
      const promptData = {
        type: "INGREDIENTS",
        ingredients: {
          urgent: urgentItems,
          normal: normalItems,
        },
        seasonings: mySeasonings,
        // 활성화된 상세 취향이 있으면 해당 데이터를, 없으면 일반 취향임을 명시
        userPreference: activePreferenceDetail ? {
          name: activePreferenceDetail.preferenceName,
          diet: activePreferenceDetail.isOnDiet,
          vegan: activePreferenceDetail.veganOption,
          spice: activePreferenceDetail.spiceLevel,
          disliked: activePreferenceDetail.dislikedFoods,
          preferredFoodTypes: activePreferenceDetail.preferredFoodTypes,
          preferredTastes: activePreferenceDetail.preferredTastes,
          allergy: activePreferenceDetail.allergyInfo
        } : "일반적인 취향"
      };

      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(promptData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/menu-select/result?data=${encodeURIComponent(JSON.stringify(data))}`);
      } else {
        alert("레시피 추천에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("추천 요청 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1A1A1A]">
      <div className="w-full max-w-md mx-auto sticky top-0 bg-white z-20 font-bold">
        <Header title="냉장고 파먹기" backLink="/Home" />
      </div>

      <div className="w-full max-w-md mx-auto pt-14 px-6 pb-32 flex-1">
        <section className="mb-6">
          <h2 className="text-[20px] font-black leading-tight mb-2">
            냉장고에 어떤<br />재료가 남았나요?
          </h2>
          <p className="text-[13px] text-gray-400 font-bold">
            유통기한 임박 재료는 <span className="text-[#FF4D4D]">🔥 아이콘</span> 클릭!
          </p>
        </section>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddIngredient(inputValue)}
            placeholder="재료명을 직접 입력하세요"
            className="flex-1 px-4 py-3.5 bg-[#F7F8F9] rounded-xl focus:outline-none text-[14px] font-bold"
          />
          <button 
            onClick={() => handleAddIngredient(inputValue)}
            className="px-5 py-3.5 bg-[#1A1A1A] text-white rounded-xl font-bold text-[14px]"
          >
            추가
          </button>
        </div>

        {/* 장바구니 영역 */}
        <div className="mb-10 relative">
          <h3 className="text-[12px] font-black text-gray-400 uppercase mb-3">나의 냉장고 속 재료</h3>
          <div className={`min-h-[110px] p-4 rounded-2xl transition-all ${selectedIngredients.length === 0 ? 'bg-[#F7F8F9] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center' : 'bg-[#F7F8F9]/50 border border-gray-100'}`}>
            <AnimatePresence mode="popLayout">
              {selectedIngredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {showGuide && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute -top-10 left-0 bg-[#FF4D4D] text-white text-[10px] px-2 py-1.5 rounded-lg font-bold shadow-lg z-10">
                      유통기한 임박 재료는 불꽃을 클릭! 🔥
                      <div className="absolute -bottom-1 left-3 w-2 h-2 bg-[#FF4D4D] rotate-45" />
                    </motion.div>
                  )}
                  {selectedIngredients.map((item) => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-sm font-bold text-[13px] transition-all ${
                        item.isUrgent 
                          ? 'bg-[#FF4D4D] text-white ring-4 ring-[#FF4D4D]/10' 
                          : 'bg-white text-[#1A1A1A] border border-gray-100'
                      }`}
                    >
                      <button 
                        onClick={() => toggleUrgent(item.name)} 
                        className={`flex items-center gap-1 transition-all ${item.isUrgent ? 'opacity-100' : 'opacity-20 grayscale'}`}
                      >
                        🔥 {item.isUrgent && <span className="text-[10px] bg-white text-[#FF4D4D] px-1 rounded">임박</span>}
                      </button>
                      <span>{item.name}</span>
                      <button onClick={() => handleRemoveIngredient(item.name)} className="ml-1 text-[12px] opacity-40">✕</button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-[12px] font-bold">비어있음</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 카테고리 탭 & 리스트 */}
        <section className="mb-6">
          <div className="flex gap-4 mb-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {Object.keys(CATEGORIZED_INGREDIENTS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 text-[13px] font-black transition-all whitespace-nowrap ${activeTab === tab ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A]' : 'text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {CATEGORIZED_INGREDIENTS[activeTab].map((name) => {
              const isSelected = selectedIngredients.some(i => i.name === name);
              return (
                <button
                  key={name}
                  onClick={() => isSelected ? handleRemoveIngredient(name) : handleAddIngredient(name)}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all ${isSelected ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="bg-[#F0FBF9] p-4 rounded-2xl flex items-start justify-between gap-3 border border-[#D0F5EF]">
            <div className="flex gap-3">
              <span className="text-[18px] leading-none mt-0.5">🧂</span>
              <div>
                <p className="text-[12px] text-[#1A1A1A] font-bold mb-0.5">집에 양념이 없으신가요?</p>
                <p className="text-[11px] text-[#2BBDA0] font-medium leading-relaxed">
                  기본 양념 유무를 설정해주시면 <br/>그에 맞는 최적의 레시피를 짜드릴게요.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/menu-select/ingredients/seasoning')} 
              className="text-[11px] font-bold text-[#2BBDA0] bg-white px-2 py-1 rounded-lg border border-[#D0F5EF] shrink-0"
            >
              양념 설정
            </button>
          </div>
        </section>
      </div>

      {/* 🌟 활성화된 입맛 배지 표시 🌟 */}
      {activePreferenceDetail && selectedIngredients.length > 0 && (
        <div className="fixed bottom-[104px] left-0 right-0 flex justify-center z-50 pointer-events-none px-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1A1A1A]/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 pointer-events-auto border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#3CDCBA] rounded-full animate-pulse" />
              <p className="text-[11px] font-bold">
                <span className="text-[#3CDCBA]">'{activePreferenceDetail.preferenceName}'</span> 입맛 반영 중
              </p>
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <span className="text-[9px] font-black text-gray-400 uppercase">AI Filter</span>
          </motion.div>
        </div>
      )}

      <Footer
        type="button"
        buttonText={loading ? "레시피 분석 중..." : `${selectedIngredients.length}개 재료로 추천 받기`}
        onButtonClick={handleComplete}
        disabled={selectedIngredients.length === 0 || loading}
      />
    </div>
  );
}
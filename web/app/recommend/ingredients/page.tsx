"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

export default function IngredientPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 자주 사용하는 재료 추천
  const commonIngredients = [
    "감자", "양파", "당근", "대파", "마늘",
    "계란", "두부", "김치", "고추", "버섯",
    "돼지고기", "소고기", "닭고기", "새우", "오징어"
  ];

  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;
    if (selectedIngredients.includes(inputValue.trim())) {
      alert("이미 추가된 재료입니다.");
      return;
    }
    setSelectedIngredients([...selectedIngredients, inputValue.trim()]);
    setInputValue("");
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
  };

  const handleCommonIngredientClick = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      handleRemoveIngredient(ingredient);
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleComplete = async () => {
    if (loading || selectedIngredients.length === 0) return;

    const message = `냉장고에 ${selectedIngredients.join(", ")}이(가) 있어요. 이 재료들로 만들 수 있는 음식을 추천해주세요.`;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai-recommendations/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 추천 결과 페이지로 이동
        router.push(`/recommend/result?data=${encodeURIComponent(JSON.stringify(data))}`);
      } else {
        alert("추천을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="재료 추천" backLink="/Home" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <h2 className="text-2xl font-bold mb-2">어떤 재료가 있나요?</h2>
        <p className="text-sm text-gray-500 mb-6">냉장고에 있는 재료를 입력해주세요</p>

        {/* 검색창 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
            placeholder="재료를 입력하세요"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D9A0]"
          />
          <button
            onClick={handleAddIngredient}
            className="px-6 py-3 bg-[#00D9A0] text-white rounded-xl font-medium hover:bg-[#00C090] transition-colors"
          >
            추가
          </button>
        </div>

        {/* 선택된 재료 */}
        {selectedIngredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">선택된 재료</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="px-4 py-2 bg-[#00D9A0] text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#00C090] transition-colors"
                >
                  {ingredient}
                  <span className="text-lg leading-none">×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 자주 사용하는 재료 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">자주 사용하는 재료</h3>
          <div className="flex flex-wrap gap-2">
            {commonIngredients.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => handleCommonIngredientClick(ingredient)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIngredients.includes(ingredient)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer
        type="button"
        buttonText={loading ? "추천 받는 중..." : "완료"}
        onButtonClick={handleComplete}
        disabled={selectedIngredients.length === 0 || loading}
      />
    </div>
  );
}
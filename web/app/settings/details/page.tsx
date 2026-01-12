"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { motion, AnimatePresence } from "framer-motion"; // 애니메이션 추가

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

export default function DetailsSettingsPage() {
  const router = useRouter();
  
  // 별칭
  const [nickname, setNickname] = useState("");
  
  // 선호하는 음식
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  
  // 생활 습관 맛
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  
  // 시식 인원
  const [servings, setServings] = useState(2);
  
  // 알레르기 목록
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  
  // 싫어하는 음식
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [newDislikedFood, setNewDislikedFood] = useState("");
  const [showDislikedFoodModal, setShowDislikedFoodModal] = useState(false);
  
  // 비건 여부
  const [selectedVegan, setSelectedVegan] = useState<string>("");
  
  // 다이어트 여부
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  
  // 매운맛 단계
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>("");

  const preferences = ["한식", "중식", "일식", "양식", "아시안", "디저트", "기타"];
  const habits = ["단맛", "짠맛", "신맛", "쓴맛", "감칠맛", "고소한맛"];
  const veganOptions = [
    "해당없음",
    "비건",
    "락토_베지테리언",
    "락토_오보_베지테리언",
    "오보_베지테리언",
    "페스코_베지테리언",
    "폴로_베지테리언",
    "프루테리언",
    "플렉시테리언"
  ];
  const dietOptions = ["다이어트_중", "해당_없음"];
  const spiceLevelOptions = ["맵찔이", "순한맛", "신라면", "불닭", "핵불닭"];

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
      setShowAllergyModal(false);
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleAddDislikedFood = () => {
    if (newDislikedFood.trim()) {
      setDislikedFoods([...dislikedFoods, newDislikedFood.trim()]);
      setNewDislikedFood("");
      setShowDislikedFoodModal(false);
    }
  };

  const handleRemoveDislikedFood = (food: string) => {
    setDislikedFoods(dislikedFoods.filter((f) => f !== food));
  };

  const handleSave = async () => {
    // 필수 필드 검증
    if (selectedPreferences.length === 0) {
      alert("선호하는 음식을 1개 이상 선택해주세요.");
      return;
    }
    
    if (selectedHabits.length === 0) {
      alert("생활습관 맛을 1개 이상 선택해주세요.");
      return;
    }
    
    if (!selectedDiet) {
      alert("다이어트 여부를 선택해주세요.");
      return;
    }
    
    if (!selectedVegan) {
      alert("비건 여부를 선택해주세요.");
      return;
    }
    
    if (!selectedSpiceLevel) {
      alert("매운맛 단계를 선택해주세요.");
      return;
    }

    try {
      const settingsData = {
        preferenceName: nickname || undefined,
        numberOfDiners: servings,
        allergyInfo: allergies.length > 0 ? allergies.join(", ") : undefined,
        isOnDiet: selectedDiet,
        veganOption: selectedVegan,
        spiceLevel: selectedSpiceLevel,
        preferredFoodTypes: selectedPreferences,
        preferredTastes: selectedHabits,
        dislikedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined,
      };

      const response = await fetch(`${API_URL}/api/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "저장 실패");
      }

      alert("설정이 저장되었습니다.");
      router.back();

    } catch (error) {
      console.error("저장 중 오류:", error);
      alert(`설정 저장에 실패했습니다: ${error instanceof Error ? error.message : "다시 시도해주세요"}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="w-full max-w-sm mx-auto sticky top-0 bg-white z-10">
        <Header title="상세한 정보를 입력해 주세요" backLink="/Home" isSignup />
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 w-full max-w-sm mx-auto px-6 pt-16 pb-32 overflow-y-auto">
        
        {/* 별칭 입력 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">
            별칭 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별칭을 입력해주세요"
            className="w-full px-5 py-4 bg-[#F8F9FA] rounded-[18px] text-sm focus:outline-none focus:ring-2 focus:ring-[#3CDCBA]/20 transition-all border border-transparent focus:border-[#3CDCBA]"
          />
        </div>
        
        {/* 선호하는 음식 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            선호하는 음식 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <motion.button
                key={pref}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedPreferences.includes(pref)
                    ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20"
                    : "bg-[#F2F2F4] text-[#777777]"
                }`}
              >
                {pref}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 생활습관 맛 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            선호하는 맛 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <motion.button
                key={habit}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSelection(habit, selectedHabits, setSelectedHabits)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedHabits.includes(habit)
                    ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20"
                    : "bg-[#F2F2F4] text-[#777777]"
                }`}
              >
                {habit}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 시식 인원 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            식사 인원 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex items-center gap-6 bg-[#F8F9FA] w-fit px-6 py-3 rounded-full border border-gray-50">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="text-[20px] font-bold text-gray-400"
            >
              －
            </motion.button>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-black text-[#1A1A1A]">{servings}</span>
              <span className="text-sm font-medium text-gray-500">명</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setServings(servings + 1)}
              className="text-[20px] font-bold text-[#3CDCBA]"
            >
              ＋
            </motion.button>
          </div>
        </div>

        {/* 알레르기 정보 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">
            알레르기 정보 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAllergyModal(true)}
              className="px-4 py-2 rounded-full border-2 border-dashed border-gray-200 text-gray-400 text-[13px] font-bold hover:border-[#3CDCBA] hover:text-[#3CDCBA] transition-colors"
            >
              + 추가하기
            </button>
            {allergies.map((allergy, index) => (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={index}
                className="px-4 py-2 bg-[#EFFFFB] text-[#3CDCBA] rounded-full text-[13px] font-bold flex items-center gap-2"
              >
                <span>{allergy}</span>
                <button
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="text-lg leading-none opacity-60"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 싫어하는 음식 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">
            싫어하는 음식 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDislikedFoodModal(true)}
              className="px-4 py-2 rounded-full border-2 border-dashed border-gray-200 text-gray-400 text-[13px] font-bold hover:border-[#3CDCBA] hover:text-[#3CDCBA] transition-colors"
            >
              + 추가하기
            </button>
            {dislikedFoods.map((food, index) => (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={index}
                className="px-4 py-2 bg-[#EFFFFB] text-[#3CDCBA] rounded-full text-[13px] font-bold flex items-center gap-2"
              >
                <span>{food}</span>
                <button
                  onClick={() => handleRemoveDislikedFood(food)}
                  className="text-lg leading-none opacity-60"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 비건 여부 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            비건 여부 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {veganOptions.map((vegan) => (
              <motion.button
                key={vegan}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVegan(vegan)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedVegan === vegan
                    ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20"
                    : "bg-[#F2F2F4] text-[#777777]"
                }`}
              >
                {vegan.replace(/_/g, " ")}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 다이어트 여부 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            다이어트 여부 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex gap-2">
            {dietOptions.map((diet) => (
              <motion.button
                key={diet}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDiet(diet)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedDiet === diet
                    ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20"
                    : "bg-[#F2F2F4] text-[#777777]"
                }`}
              >
                {diet.replace(/_/g, " ")}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 매운맛 단계 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">
            매운맛 단계 <span className="text-[#3CDCBA]">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {spiceLevelOptions.map((level) => (
              <motion.button
                key={level}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSpiceLevel(level)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedSpiceLevel === level
                    ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20"
                    : "bg-[#F2F2F4] text-[#777777]"
                }`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 알레르기 추가 모달 */}
      <AnimatePresence>
        {showAllergyModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[28px] p-7 w-full max-w-xs shadow-xl"
            >
              <h3 className="text-[18px] font-black mb-5 text-center text-[#1A1A1A]">알레르기 정보 추가</h3>
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="ex) 갑각류, 견과류"
                className="w-full px-5 py-3.5 bg-[#F8F9FA] rounded-[18px] mb-6 focus:outline-none focus:ring-2 focus:ring-[#3CDCBA] text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAllergyModal(false); setNewAllergy(""); }}
                  className="flex-1 py-3.5 bg-[#F2F2F4] text-[#777777] rounded-full font-bold text-sm"
                >
                  취소
                </button>
                <button
                  onClick={handleAddAllergy}
                  className="flex-1 py-3.5 bg-[#3CDCBA] text-white rounded-full font-bold text-sm shadow-md shadow-[#3CDCBA]/20"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 싫어하는 음식 추가 모달 */}
      <AnimatePresence>
        {showDislikedFoodModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[28px] p-7 w-full max-w-xs shadow-xl"
            >
              <h3 className="text-[18px] font-black mb-5 text-center text-[#1A1A1A]">싫어하는 음식 추가</h3>
              <input
                type="text"
                value={newDislikedFood}
                onChange={(e) => setNewDislikedFood(e.target.value)}
                placeholder="ex) 오이, 당근"
                className="w-full px-5 py-3.5 bg-[#F8F9FA] rounded-[18px] mb-6 focus:outline-none focus:ring-2 focus:ring-[#3CDCBA] text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDislikedFoodModal(false); setNewDislikedFood(""); }}
                  className="flex-1 py-3.5 bg-[#F2F2F4] text-[#777777] rounded-full font-bold text-sm"
                >
                  취소
                </button>
                <button
                  onClick={handleAddDislikedFood}
                  className="flex-1 py-3.5 bg-[#3CDCBA] text-white rounded-full font-bold text-sm shadow-md shadow-[#3CDCBA]/20"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 푸터 (고정 완료 버튼) */}
      <Footer
        type="button"
        buttonText="설정 완료하기"
        onButtonClick={handleSave}
      />
    </div>
  );
}
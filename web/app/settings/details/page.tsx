"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";

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
      // API 명세서에 맞게 데이터 변환
      const settingsData = {
        preferenceName: nickname || undefined, // 선택 사항
        numberOfDiners: servings,
        allergyInfo: allergies.length > 0 ? allergies.join(", ") : undefined, // 선택 사항
        isOnDiet: selectedDiet, // "다이어트_중" | "해당_없음"
        veganOption: selectedVegan, // "비건" | "락토_베지테리언" | ... | "해당없음"
        spiceLevel: selectedSpiceLevel, // "맵찔이" | "순한맛" | ...
        preferredFoodTypes: selectedPreferences, // 필수, 1개 이상
        preferredTastes: selectedHabits, // 필수, 1개 이상
        dislikedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined, // 선택 사항
      };

      console.log("전송 데이터:", settingsData);

      // POST /api/preferences
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

      // 성공 시 Location 헤더에서 생성된 리소스 ID 확인 가능
      const locationHeader = response.headers.get("Location");
      console.log("생성된 리소스:", locationHeader);

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
      <div className="w-full max-w-sm mx-auto">
        <Header title="상세한 정보를 입력해 주세요" backLink="/Home" isSignup />
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 w-full max-w-sm mx-auto px-6 pb-24 overflow-y-auto">
        
        {/* 별칭 입력 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            별칭 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별칭을 입력해주세요"
            className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00D9A0]"
          />
        </div>
        
        {/* 선호하는 음식 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            선호하는 음식 <span className="text-red-500">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <button
                key={pref}
                onClick={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedPreferences.includes(pref)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* 생활습관 맛 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            선호하는 맛 <span className="text-red-500">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <button
                key={habit}
                onClick={() => toggleSelection(habit, selectedHabits, setSelectedHabits)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedHabits.includes(habit)
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {habit}
              </button>
            ))}
          </div>
        </div>

        {/* 시식 인원 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            식사 인원 <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
            >
              -
            </button>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{servings}</span>
              <span className="text-base text-gray-500">명</span>
            </div>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* 알레르기 정보 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            알레르기 정보 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowAllergyModal(true)}
              className="w-8 h-8 rounded-full bg-[#00D9A0] text-white flex items-center justify-center text-xl font-bold hover:bg-[#00C090]"
            >
              +
            </button>
            <span className="text-sm text-[#00D9A0] font-medium">입력하기</span>
          </div>
          {allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                >
                  <span className="text-gray-700">{allergy}</span>
                  <button
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 싫어하는 음식 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            싫어하는 음식 <span className="text-gray-400 font-normal">(선택)</span>
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowDislikedFoodModal(true)}
              className="w-8 h-8 rounded-full bg-[#00D9A0] text-white flex items-center justify-center text-xl font-bold hover:bg-[#00C090]"
            >
              +
            </button>
            <span className="text-sm text-[#00D9A0] font-medium">입력하기</span>
          </div>
          {dislikedFoods.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dislikedFoods.map((food, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                >
                  <span className="text-gray-700">{food}</span>
                  <button
                    onClick={() => handleRemoveDislikedFood(food)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 비건 여부 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            비건 여부 <span className="text-red-500">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {veganOptions.map((vegan) => (
              <button
                key={vegan}
                onClick={() => setSelectedVegan(vegan)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedVegan === vegan
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {vegan.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* 다이어트 여부 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            다이어트 여부 <span className="text-red-500">*</span>
          </h3>
          <div className="flex gap-2">
            {dietOptions.map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedDiet === diet
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {diet.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* 매운맛 단계 */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            매운맛 단계 <span className="text-red-500">*</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {spiceLevelOptions.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedSpiceLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSpiceLevel === level
                    ? "bg-[#00D9A0] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 알레르기 추가 모달 */}
      {showAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">알레르기 정보를 추가해 주세요</h3>
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="ex) 갑각류"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#00D9A0] text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAllergyModal(false);
                  setNewAllergy("");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleAddAllergy}
                className="flex-1 py-3 bg-[#00D9A0] text-white rounded-full font-medium text-sm hover:bg-[#00C090]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 싫어하는 음식 추가 모달 */}
      {showDislikedFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">싫어하는 음식을 추가해 주세요</h3>
            <input
              type="text"
              value={newDislikedFood}
              onChange={(e) => setNewDislikedFood(e.target.value)}
              placeholder="ex) 파"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#00D9A0] text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDislikedFoodModal(false);
                  setNewDislikedFood("");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleAddDislikedFood}
                className="flex-1 py-3 bg-[#00D9A0] text-white rounded-full font-medium text-sm hover:bg-[#00C090]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <Footer
        type="button"
        buttonText="완료"
        onButtonClick={handleSave}
      />
    </div>
  );
}
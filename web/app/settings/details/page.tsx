"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  createPreference,
  type DietStatus,
  type VeganOption,
  type SpiceLevel,
  type FoodType,
  type TasteType
} from "@/app/api/preferenceApi";

// 내부 컴포넌트: 섹션 제목
const SectionTitle = ({ title, required = false, sub = "" }: { title: string; required?: boolean; sub?: string }) => (
  <div className="flex items-baseline gap-1.5 mb-4">
    <h3 className="text-[16px] font-black text-[#1A1A1A] leading-none">{title}</h3>
    {required && <span className="w-1.5 h-1.5 rounded-full bg-[#3CDCBA]" />}
    {sub && <span className="text-xs text-gray-400 font-normal ml-0.5">{sub}</span>}
  </div>
);

export default function DetailsSettingsPage() {
  const router = useRouter();
  const { refreshPreferences } = useUser();

  const [nickname, setNickname] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<FoodType[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<TasteType[]>([]);
  const [servings, setServings] = useState(2);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [newDislikedFood, setNewDislikedFood] = useState("");
  const [showDislikedFoodModal, setShowDislikedFoodModal] = useState(false);
  const [selectedVegan, setSelectedVegan] = useState<VeganOption | "">("");
  const [selectedDiet, setSelectedDiet] = useState<DietStatus | "">("");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel | "">("");

  const preferences: FoodType[] = ["한식", "중식", "일식", "양식", "아시안", "디저트", "기타"];
  const habits: TasteType[] = ["단맛", "짠맛", "신맛", "쓴맛", "감칠맛", "고소한맛"];

  // VeganOption UI 표시를 위한 매핑 (UI 라벨: 백엔드 값)
  const veganOptionMap: { label: string; value: VeganOption }[] = [
    { label: "해당없음", value: "해당없음" },
    { label: "비건", value: "비건" },
    { label: "락토", value: "락토_베지테리언" },
    { label: "오보", value: "오보_베지테리언" },
    { label: "락토오보", value: "락토_오보_베지테리언" },
    { label: "페스코", value: "페스코_베지테리언" },
    { label: "폴로", value: "폴로_베지테리언" },
    { label: "프루테리언", value: "프루테리언" },
    { label: "플렉시", value: "플렉시테리언" },
  ];

  const dietOptions: DietStatus[] = ["다이어트_중", "해당_없음"];
  const spiceLevelOptions: SpiceLevel[] = ["맵찔이", "순한맛", "신라면", "불닭", "핵불닭"];

  const toggleSelection = <T,>(item: T, list: T[], setList: (list: T[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    if (selectedPreferences.length === 0) return alert("선호하는 음식을 선택해주세요.");
    if (selectedHabits.length === 0) return alert("선호하는 맛을 선택해주세요.");
    if (!selectedDiet || !selectedVegan || !selectedSpiceLevel) return alert("필수 항목(*)을 모두 선택해주세요.");

    try {
      const settingsData = {
        preferenceName: nickname || "기본 취향",
        numberOfDiners: servings,
        allergyInfo: allergies.length > 0 ? allergies.join(", ") : undefined,
        isOnDiet: selectedDiet,
        veganOption: selectedVegan,
        spiceLevel: selectedSpiceLevel,
        preferredFoodTypes: selectedPreferences,
        preferredTastes: selectedHabits,
        dislikedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined,
      };

      console.log("저장할 데이터:", settingsData);

      // API를 통한 선호도 생성
      await createPreference(settingsData);

      // Context의 preferences 새로고침
      await refreshPreferences();

      alert("설정이 저장되었습니다.");
      router.back();
    } catch (error) {
      console.error("설정 저장 실패:", error);
      alert(`설정 저장에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <div className="w-full max-w-sm mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <Header title="상세 정보 입력" backLink="/Home" isSignup />
      </div>

      <div className="flex-1 w-full max-w-sm mx-auto px-5 pt-8 pb-32">
        {/* 프로필 섹션 */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <SectionTitle title="프로필" sub="(선택)" />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="나만의 식사 별칭을 입력해주세요"
            className="w-full px-5 py-4 bg-[#F8F9FA] rounded-[15px] text-sm focus:bg-white focus:ring-2 focus:ring-[#3CDCBA]/20 border-2 border-transparent focus:border-[#3CDCBA] outline-none transition-all"
          />
        </div>

        {/* 인원 설정 섹션 */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <SectionTitle title="식사 인원" required />
          <div className="flex items-center justify-between bg-[#F8F9FA] p-2 rounded-[18px]">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-[14px] shadow-sm text-gray-400 font-bold text-xl"
            >－</motion.button>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#1A1A1A]">{servings}</span>
              <span className="text-sm font-bold text-gray-500">명</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setServings(servings + 1)}
              className="w-12 h-12 flex items-center justify-center bg-[#3CDCBA] rounded-[14px] shadow-sm text-white font-bold text-xl"
            >＋</motion.button>
          </div>
        </div>

        {/* 입맛 취향 섹션 */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <SectionTitle title="입맛 취향" required />
          <div className="space-y-6">
            <div>
              <p className="text-[13px] text-gray-400 mb-3 ml-1">선호하는 음식 카테고리</p>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <motion.button
                    key={pref}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
                    className={`px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all ${
                      selectedPreferences.includes(pref) ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/30" : "bg-[#F2F2F4] text-[#888]"
                    }`}
                  > {pref} </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-gray-400 mb-3 ml-1">선호하는 맛</p>
              <div className="flex flex-wrap gap-2">
                {habits.map((habit) => (
                  <motion.button
                    key={habit}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelection(habit, selectedHabits, setSelectedHabits)}
                    className={`px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all ${
                      selectedHabits.includes(habit) ? "bg-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/30" : "bg-[#F2F2F4] text-[#888]"
                    }`}
                  > {habit} </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 건강 및 제약 섹션 */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <SectionTitle title="식단 및 제약" required />
          <div className="space-y-6">
            <div>
              <p className="text-[13px] text-gray-400 mb-3 ml-1">매운맛 단계</p>
              <div className="grid grid-cols-5 gap-1.5">
                {spiceLevelOptions.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedSpiceLevel(level)}
                    className={`py-2.5 rounded-[10px] text-[11px] font-black border-2 transition-all ${
                      selectedSpiceLevel === level ? "border-[#3CDCBA] bg-[#EFFFFB] text-[#3CDCBA]" : "border-transparent bg-[#F8F9FA] text-[#AAA]"
                    }`}
                  > {level} </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-gray-400 mb-3 ml-1">비건/다이어트 여부</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {veganOptionMap.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setSelectedVegan(v.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold ${selectedVegan === v.value ? "bg-[#1A1A1A] text-white" : "bg-[#F2F2F4] text-[#888]"}`}
                  > {v.label} </button>
                ))}
              </div>
              <div className="flex gap-2">
                {dietOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiet(d)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold ${selectedDiet === d ? "bg-[#FF7A5C] text-white shadow-lg shadow-[#FF7A5C]/20" : "bg-[#F2F2F4] text-[#888]"}`}
                  > {d.replace("_", " ")} </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 추가 정보 (알레르기, 싫어하는 음식) */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-dashed border-gray-100">
          <SectionTitle title="제외 항목" sub="(선택)" />
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] font-bold text-gray-500">알레르기</span>
                <button onClick={() => setShowAllergyModal(true)} className="text-[12px] text-[#3CDCBA] font-black">+ 추가</button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {allergies.map((a) => (
                  <span key={a} className="px-3 py-1.5 bg-[#EFFFFB] text-[#3CDCBA] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    {a} <button onClick={() => setAllergies(allergies.filter(i => i !== a))} className="text-sm">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] font-bold text-gray-500">싫어하는 음식</span>
                <button onClick={() => setShowDislikedFoodModal(true)} className="text-[12px] text-[#3CDCBA] font-black">+ 추가</button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {dislikedFoods.map((f) => (
                  <span key={f} className="px-3 py-1.5 bg-[#FFF0EE] text-[#FF7A5C] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    {f} <button onClick={() => setDislikedFoods(dislikedFoods.filter(i => i !== f))} className="text-sm">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 공통 스타일 적용 */}
      <AnimatePresence>
        {(showAllergyModal || showDislikedFoodModal) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-xs shadow-2xl">
              <h3 className="text-lg font-black mb-6 text-center text-[#1A1A1A]">
                {showAllergyModal ? "알레르기 정보 추가" : "싫어하는 음식 추가"}
              </h3>
              <input
                type="text"
                autoFocus
                value={showAllergyModal ? newAllergy : newDislikedFood}
                onChange={(e) => showAllergyModal ? setNewAllergy(e.target.value) : setNewDislikedFood(e.target.value)}
                placeholder="내용을 입력해주세요"
                className="w-full px-5 py-4 bg-[#F8F9FA] rounded-[18px] mb-8 focus:ring-2 focus:ring-[#3CDCBA] outline-none border-none text-center font-bold"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    showAllergyModal ? (newAllergy && (setAllergies([...allergies, newAllergy]), setNewAllergy(""), setShowAllergyModal(false))) : (newDislikedFood && (setDislikedFoods([...dislikedFoods, newDislikedFood]), setNewDislikedFood(""), setShowDislikedFoodModal(false)))
                  }
                }}
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowAllergyModal(false); setShowDislikedFoodModal(false); }} className="flex-1 py-4 bg-[#F2F2F4] text-[#777] rounded-[18px] font-bold">취소</button>
                <button onClick={() => {
                  if (showAllergyModal && newAllergy) { setAllergies([...allergies, newAllergy]); setNewAllergy(""); setShowAllergyModal(false); }
                  else if (newDislikedFood) { setDislikedFoods([...dislikedFoods, newDislikedFood]); setNewDislikedFood(""); setShowDislikedFoodModal(false); }
                }} className="flex-1 py-4 bg-[#3CDCBA] text-white rounded-[18px] font-bold shadow-lg shadow-[#3CDCBA]/20">추가</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer type="button" buttonText="저장하고 메뉴 추천받기" onButtonClick={handleSave} />
    </div>
  );
}

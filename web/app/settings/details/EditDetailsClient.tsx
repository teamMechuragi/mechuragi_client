"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { useToast } from "@/app/common/ToastProvider";
import { useLoading } from "@/app/context/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPreference,
  createPreference,
  updatePreference,
  type DietStatus,
  type VeganOption,
  type SpiceLevel,
  type FoodType,
  type TasteType
} from "@/app/api/preferenceApi";

// 섹션 타이틀 컴포넌트
const SectionTitle = ({ title, isDone = false, required = false, sub = "" }: { title: string; isDone?: boolean; required?: boolean; sub?: string }) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex items-center gap-1.5">
      <h3 className={`text-[16px] font-black tracking-tight transition-colors ${isDone ? "text-[#3CDCBA]" : "text-[#1A1A1A]"}`}>
        {title}
      </h3>
      {isDone ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#3CDCBA] text-[14px]">✔</motion.span>
      ) : (
        required && <span className="text-[#3CDCBA] font-bold text-[16px]">*</span>
      )}
    </div>
    {sub && <span className="text-[12px] text-gray-400 font-medium leading-tight">{sub}</span>}
  </div>
);

export default function EditDetailsClient() {
  const router = useRouter();
  const { refreshPreferences } = useUser();
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setEditId(id && id !== "new" ? id : null);
    }
  }, []);

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

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preferences: FoodType[] = ["한식", "중식", "일식", "양식", "아시안", "디저트", "기타"];
  const habits: TasteType[] = ["단맛", "짠맛", "신맛", "쓴맛", "감칠맛", "고소한맛"];

  const veganOptionMap: { label: string; value: VeganOption }[] = [
    { label: "해당없음", value: "NONE" },
    { label: "비건", value: "VEGAN" },
    { label: "베지테리언", value: "VEGETARIAN" },
    { label: "페스코", value: "PESCATARIAN" },
    { label: "플렉시테리언", value: "FLEXITARIAN" },
  ];

  const dietOptionMap: { label: string; value: DietStatus }[] = [
    { label: "해당 없음", value: "NONE" },
    { label: "다이어트 중", value: "WEIGHT_LOSS" },
    { label: "근성장", value: "BULKING" },
    { label: "유지어터", value: "MAINTENANCE" },
  ];
  const spiceLevelOptions: { label: string; value: SpiceLevel }[] = [
    { label: "맵찔이", value: "VERY_MILD" },
    { label: "순한맛", value: "MILD" },
    { label: "신라면", value: "MEDIUM" },
    { label: "불닭", value: "HOT" },
    { label: "핵불닭", value: "EXTREME" },
  ];

  useEffect(() => {
    if (editId) {
      const fetchDetail = async () => {
        try {
          const data = await getPreference(parseInt(editId));
          if (!data || !data.preferenceName) return;
          setNickname(data.preferenceName);
          setServings(data.numberOfDiners);
          setAllergies(data.allergies || []);
          setSelectedDiet(data.dietStatus);
          setSelectedVegan(data.veganOption);
          setSelectedSpiceLevel(data.spiceLevel);
          setSelectedPreferences(data.preferredFoodTypes || []);
          setSelectedHabits(data.preferredTastes || []);
          setDislikedFoods(data.avoidedFoods || []);
        } catch (error) {
          showToast("데이터를 불러오는데 실패했습니다.", "error");
        }
      };
      fetchDetail();
    }
  }, [editId]);

  const toggleSelection = <T,>(item: T, list: T[], setList: (list: T[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) { showToast("별칭을 입력해주세요!", "error"); return; }
    if (selectedPreferences.length === 0) { showToast("선호 카테고리를 선택해주세요.", "error"); return; }
    if (!selectedDiet || !selectedVegan || !selectedSpiceLevel) { showToast("필수 항목을 모두 선택해주세요.", "error"); return; }

    setIsSubmitting(true);
    startLoading('TASTE');

    try {
      const payload = {
        preferenceName: nickname.trim(),
        numberOfDiners: servings,
        dietStatus: selectedDiet,
        veganOption: selectedVegan,
        spiceLevel: selectedSpiceLevel,
        preferredFoodTypes: selectedPreferences,
        preferredTastes: selectedHabits,
        avoidedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined,
        allergies: allergies.length > 0 ? allergies : undefined,
      };

      if (editId) {
        await updatePreference(parseInt(editId), payload);
      } else {
        await createPreference(payload);
      }

      await refreshPreferences();
      setIsSaved(true);
    } catch (error) {
      showToast("저장 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const getButtonSummary = () => {
    if (isSubmitting) return "저장 중...";
    const serve = servings === 1 ? "혼밥" : `${servings}인`;
    return `${nickname || "입맛"} (${serve}) 저장하기`;
  };

  const getAnalysisKeywords = () => {
    const tags = [];
    if (selectedPreferences[0]) tags.push(`#${selectedPreferences[0]}`);
    if (selectedSpiceLevel) tags.push(`#${spiceLevelOptions.find(o => o.value === selectedSpiceLevel)?.label}`);
    if (servings) tags.push(`#${servings}인분`);
    return tags.slice(0, 3);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100 px-4 py-3 flex items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="flex-1 text-center font-black text-[16px]">{editId ? "입맛 수정하기" : "입맛 상세 설정"}</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-40 space-y-12">
        <section>
          <SectionTitle title="설정 별칭" isDone={nickname.length > 0} required />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: 주말 홈파티"
            className="w-full px-4 py-3.5 bg-[#F7F8F9] rounded-xl text-[15px] font-bold focus:bg-white focus:ring-1 focus:ring-[#3CDCBA] border border-transparent focus:border-[#3CDCBA] outline-none transition-all"
          />
        </section>

        <section>
          <SectionTitle title="식사 인원" isDone={true} required />
          <div className="flex items-center justify-between bg-white border border-gray-100 px-5 py-3.5 rounded-2xl shadow-sm">
            <span className="text-[15px] font-bold text-[#1A1A1A]">{servings === 1 ? "오늘은 혼자 먹어요 🍚" : `${servings}명이 함께 먹어요 👥`}</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-9 h-9 flex items-center justify-center bg-[#F7F8F9] rounded-full text-gray-500 font-bold active:scale-90">-</button>
              <span className="w-4 text-center font-black text-[16px]">{servings}</span>
              <button onClick={() => setServings(servings + 1)} className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full text-white font-bold">+</button>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="선호 카테고리" isDone={selectedPreferences.length > 0} required />
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <button key={pref} onClick={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)} className={`px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all ${selectedPreferences.includes(pref) ? "bg-[#3CDCBA] border-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20" : "bg-white border-gray-200 text-gray-400"}`}> {pref} </button>
            ))}
          </div>
        </section>
        
        <section>
          <SectionTitle title="선호하는 맛" isDone={selectedHabits.length > 0} required />
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <button key={habit} onClick={() => toggleSelection(habit, selectedHabits, setSelectedHabits)} className={`px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all ${selectedHabits.includes(habit) ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "bg-white border-gray-200 text-gray-400"}`}> {habit} </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="매운맛 단계" isDone={selectedSpiceLevel !== ""} required />
          <div className="grid grid-cols-5 gap-1.5">
            {spiceLevelOptions.map((option) => (
              <button key={option.value} onClick={() => setSelectedSpiceLevel(option.value)} className={`py-3 rounded-lg text-[10px] font-black border transition-all ${selectedSpiceLevel === option.value ? "bg-[#EFFFFB] border-[#3CDCBA] text-[#12B896]" : "bg-white border-gray-100 text-gray-400"}`}> {option.label} </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="비건 & 식단" isDone={selectedVegan !== "" && selectedDiet !== ""} required />
          <div className="grid grid-cols-3 gap-2 mb-2">
            {veganOptionMap.map((v) => (
              <button key={v.value} onClick={() => setSelectedVegan(v.value)} className={`h-12 flex items-center justify-center rounded-xl text-[12px] font-bold border transition-all ${selectedVegan === v.value ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white border-gray-100 text-gray-400"}`}> {v.label} </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dietOptionMap.map((d) => (
              <button key={d.value} onClick={() => setSelectedDiet(d.value)} className={`h-12 flex items-center justify-center rounded-xl text-[14px] font-bold border transition-all ${selectedDiet === d.value ? "bg-[#FF7A5C] border-[#FF7A5C] text-white" : "bg-white border-gray-100 text-gray-400"}`}> {d.label} </button>
            ))}
          </div>
        </section>

        <section className="pb-10">
          <SectionTitle title="제외 항목" isDone={allergies.length > 0 || dislikedFoods.length > 0} sub="필수 아님" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={() => setShowAllergyModal(true)} className="py-4 bg-[#F7F8F9] rounded-xl text-[13px] font-bold text-gray-500">알레르기 +</button>
            <button onClick={() => setShowDislikedFoodModal(true)} className="py-4 bg-[#F7F8F9] rounded-xl text-[13px] font-bold text-gray-500">기피음식 +</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map((item) => (
              <span key={`all-${item}`} className="px-3 py-1.5 bg-[#EFFFFB] text-[#12B896] rounded-lg text-[12px] font-bold border border-[#3CDCBA]/20 flex items-center gap-1">
                <span className="text-[10px] font-black opacity-60">[알레르기]</span> {item}
                <button onClick={() => setAllergies(allergies.filter(a => a !== item))} className="ml-1 text-lg">×</button>
              </span>
            ))}
            {dislikedFoods.map((item) => (
              <span key={`dis-${item}`} className="px-3 py-1.5 bg-[#FFF5F2] text-[#FF7A5C] rounded-lg text-[12px] font-bold border border-[#FF7A5C]/20 flex items-center gap-1">
                <span className="text-[10px] font-black opacity-60">[기피]</span> {item}
                <button onClick={() => setDislikedFoods(dislikedFoods.filter(d => d !== item))} className="ml-1 text-lg">×</button>
              </span>
            ))}
          </div>
        </section>
      </div>

      <Footer type="button" buttonText={getButtonSummary()} onButtonClick={handleSave} />

      {/* 완료 UI (수정됨) */}
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-gray-50/90 backdrop-blur-sm flex flex-col items-center justify-center px-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-white/50 text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-[#F7F8F9] rounded-full flex items-center justify-center text-3xl">✨</div>
              </div>
              
              <h2 className="text-[22px] font-black text-[#1A1A1A] mb-2">{editId ? "수정 완료!" : "설정 완료!"}</h2>
              <p className="text-gray-500 font-medium text-[14px] mb-6 leading-relaxed">
                입맛 설정이 성공적으로 저장되었습니다.<br/>이제 AI 추천을 시작해볼까요?
              </p>
              
              <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                 {getAnalysisKeywords().map((tag) => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-full">
                     {tag}
                   </span>
                 ))}
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }} 
                onClick={() => router.push("/Home")} 
                className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xl font-bold text-[15px] shadow-lg shadow-black/10"
              >
                메뉴 고르러 가기
              </motion.button>
              
              <button 
                onClick={() => router.push("/settings/details")} 
                className="mt-5 text-gray-400 font-bold text-[13px] hover:text-black transition-colors"
              >
                 목록으로 돌아가기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 모달 */}
      <AnimatePresence>
        {(showAllergyModal || showDislikedFoodModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAllergyModal(false); setShowDislikedFoodModal(false); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative bg-white w-full rounded-[24px] p-6 shadow-xl">
              <h4 className="text-[17px] font-black text-center mb-5">{showAllergyModal ? "🥜 알레르기" : "🚫 기피 음식"}</h4>
              <input type="text" autoFocus value={showAllergyModal ? newAllergy : newDislikedFood} onChange={(e) => showAllergyModal ? setNewAllergy(e.target.value) : setNewDislikedFood(e.target.value)} placeholder="직접 입력하세요" className="w-full px-4 py-3 bg-gray-100 rounded-xl mb-6 outline-none border-2 border-transparent focus:border-[#3CDCBA] text-[15px] font-bold text-center" />
              <div className="flex gap-2">
                <button onClick={() => { setShowAllergyModal(false); setShowDislikedFoodModal(false); }} className="flex-1 py-3 text-gray-400 font-bold">취소</button>
                <button onClick={() => {
                  const val = showAllergyModal ? newAllergy : newDislikedFood;
                  if (val.trim()) {
                    showAllergyModal ? setAllergies([...allergies, val]) : setDislikedFoods([...dislikedFoods, val]);
                  }
                  setShowAllergyModal(false); setShowDislikedFoodModal(false);
                  setNewAllergy(""); setNewDislikedFood("");
                }} className={`flex-1 py-3 text-white rounded-xl font-bold ${showAllergyModal ? 'bg-[#3CDCBA]' : 'bg-[#FF7A5C]'}`}>확인</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
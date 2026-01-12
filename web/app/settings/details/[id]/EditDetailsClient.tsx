"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

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

export default function EditDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const editId = id !== "new" ? id : null; // id가 'new'가 아니면 수정 모드
  const { refreshPreferences } = useUser();

  // 상태 관리
  const [nickname, setNickname] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [servings, setServings] = useState(2);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [newDislikedFood, setNewDislikedFood] = useState("");
  const [showDislikedFoodModal, setShowDislikedFoodModal] = useState(false);
  const [selectedVegan, setSelectedVegan] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>("");

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preferences = ["한식", "중식", "일식", "양식", "아시안", "디저트", "기타"];
  const habits = ["단맛", "짠맛", "신맛", "쓴맛", "감칠맛", "고소한맛"];
  const veganOptions = ["해당없음", "비건", "락토", "오보", "페스코", "폴로", "플렉시"];
  const dietOptions = ["다이어트_중", "해당_없음"];
  const spiceLevelOptions = ["맵찔이", "순한맛", "신라면", "불닭", "핵불닭"];

  // ✅ 데이터 불러오기 (수정 모드)
  useEffect(() => {
    if (editId) {
      const fetchDetail = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`${API_URL}/api/preferences/${editId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            // 백엔드 필드명에 맞춰 매핑 (API 명세에 따라 조정 필요)
            setNickname(data.preferenceName);
            setServings(data.numberOfDiners);
            setAllergies(data.allergyInfo ? data.allergyInfo.split(", ") : []);
            setSelectedDiet(data.isOnDiet);
            setSelectedVegan(data.veganOption);
            setSelectedSpiceLevel(data.spiceLevel);
            setSelectedPreferences(data.preferredFoodTypes || []);
            setSelectedHabits(data.preferredTastes || []);
            setDislikedFoods(data.dislikedFoods || []);
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
        }
      };
      fetchDetail();
    }
  }, [editId]);

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // ✅ 저장 로직
  const handleSave = async () => {
    if (!nickname.trim()) return alert("별칭을 입력해주세요!");
    if (selectedPreferences.length === 0) return alert("선호 카테고리를 선택해주세요.");
    if (!selectedDiet || !selectedVegan || !selectedSpiceLevel) return alert("필수 항목을 모두 선택해주세요.");

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        preferenceName: nickname.trim(),
        numberOfDiners: servings,
        allergyInfo: allergies.length > 0 ? allergies.join(", ") : undefined,
        isOnDiet: selectedDiet,
        veganOption: selectedVegan,
        spiceLevel: selectedSpiceLevel,
        preferredFoodTypes: selectedPreferences,
        preferredTastes: selectedHabits,
        dislikedFoods: dislikedFoods.length > 0 ? dislikedFoods : undefined,
      };

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/api/preferences/${editId}` : `${API_URL}/api/preferences`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("저장 실패");

      await refreshPreferences(); // Context 동기화
      setIsSaved(true); // 성공 애니메이션 트리거

    } catch (error) {
      console.error("API 저장 에러:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
    if (selectedSpiceLevel) tags.push(`#${selectedSpiceLevel}`);
    if (servings) tags.push(`#${servings}인분`);
    return tags.slice(0, 3);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-50">
        <Header title={editId ? "입맛 수정하기" : "입맛 상세 설정"} backLink="/mypage" />
      </div>

      <div className="flex-1 w-full max-w-md mx-auto px-6 pt-14 pb-40 space-y-12">
        {/* 설정 별칭 */}
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

        {/* 식사 인원 */}
        <section>
          <SectionTitle title="식사 인원" isDone={true} required />
          <div className="flex items-center justify-between bg-white border border-gray-100 px-5 py-3.5 rounded-2xl shadow-sm">
            <span className="text-[15px] font-bold text-[#1A1A1A]">
              {servings === 1 ? "오늘은 혼자 먹어요 🍚" : `${servings}명이 함께 먹어요 👥`}
            </span>
            <div className="flex items-center gap-4">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-9 h-9 flex items-center justify-center bg-[#F7F8F9] rounded-full text-gray-500 font-bold active:scale-90">-</button>
              <span className="w-4 text-center font-black text-[16px]">{servings}</span>
              <button onClick={() => setServings(servings + 1)} className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full text-white font-bold">+</button>
            </div>
          </div>
        </section>

        {/* 선호 카테고리 */}
        <section>
          <SectionTitle title="선호 카테고리" isDone={selectedPreferences.length > 0} required />
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <button
                key={pref}
                onClick={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
                className={`px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
                  selectedPreferences.includes(pref) ? "bg-[#3CDCBA] border-[#3CDCBA] text-white shadow-md shadow-[#3CDCBA]/20" : "bg-white border-gray-200 text-gray-400"
                }`}
              > {pref} </button>
            ))}
          </div>
        </section>

        {/* 선호 맛 */}
        <section>
          <SectionTitle title="선호하는 맛" isDone={selectedHabits.length > 0} required />
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <button
                key={habit}
                onClick={() => toggleSelection(habit, selectedHabits, setSelectedHabits)}
                className={`px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
                  selectedHabits.includes(habit) ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "bg-white border-gray-200 text-gray-400"
                }`}
              > {habit} </button>
            ))}
          </div>
        </section>

        {/* 매운맛 단계 */}
        <section>
          <SectionTitle title="매운맛 단계" isDone={selectedSpiceLevel !== ""} required />
          <div className="grid grid-cols-5 gap-1.5">
            {spiceLevelOptions.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedSpiceLevel(level)}
                className={`py-3 rounded-lg text-[10px] font-black border transition-all ${
                  selectedSpiceLevel === level ? "bg-[#EFFFFB] border-[#3CDCBA] text-[#12B896]" : "bg-white border-gray-100 text-gray-400"
                }`}
              > {level} </button>
            ))}
          </div>
        </section>

        {/* 비건 & 식단 */}
        <section>
          <SectionTitle title="비건 & 식단" isDone={selectedVegan !== "" && selectedDiet !== ""} required />
          <div className="flex flex-wrap gap-2 mb-3">
            {veganOptions.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVegan(v)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all ${
                  selectedVegan === v ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white border-gray-100 text-gray-400"
                }`}
              > {v} </button>
            ))}
          </div>
          <div className="flex gap-2">
            {dietOptions.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiet(d)}
                className={`flex-1 py-4 rounded-xl text-[14px] font-black border transition-all ${
                  selectedDiet === d ? "bg-[#FF7A5C] border-[#FF7A5C] text-white" : "bg-white border-gray-100 text-gray-400"
                }`}
              > {d.replace("_", " ")} </button>
            ))}
          </div>
        </section>

        {/* 제외 항목 */}
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

      {/* 🎉 완료 화면 애니메이션 🎉 */}
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center px-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.2 }}
              className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-8 shadow-2xl overflow-hidden relative"
            >
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-[#3CDCBA]/20"
               />
               <span className="text-white text-4xl font-black relative z-10">AI</span>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <h2 className="text-[24px] font-black text-[#1A1A1A] mb-2">{editId ? "수정 완료!" : "입맛 저장 완료!"}</h2>
              <p className="text-[#3CDCBA] font-bold text-[14px] mb-8">"{nickname}" 설정이 성공적으로 반영되었습니다</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {getAnalysisKeywords().map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="px-4 py-1.5 bg-[#F7F8F9] text-[#1A1A1A] text-[12px] font-bold rounded-full border border-gray-100"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="space-y-4 mb-16 px-2">
              <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                이제 마이페이지에서 <span className="text-[#1A1A1A] font-bold">"{nickname}"</span> 토글을 켜면<br />
                해당 상황에 딱 맞는 추천을 받아볼 수 있어요.
              </p>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/Home")}
              className="w-full py-5 bg-[#3CDCBA] text-white rounded-[20px] font-black text-[17px] shadow-xl shadow-[#3CDCBA]/20 flex items-center justify-center gap-2"
            >
              <span>AI와 메뉴 고르러 가기</span>
              <span className="text-xl">✨</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 모달 */}
      <AnimatePresence>
        {(showAllergyModal || showDislikedFoodModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAllergyModal(false); setShowDislikedFoodModal(false); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full rounded-[30px] p-8 shadow-2xl">
              <h4 className="text-[18px] font-black text-center mb-6">{showAllergyModal ? "🥜 알레르기" : "🚫 기피 음식"}</h4>
              <input
                type="text"
                autoFocus
                value={showAllergyModal ? newAllergy : newDislikedFood}
                onChange={(e) => showAllergyModal ? setNewAllergy(e.target.value) : setNewDislikedFood(e.target.value)}
                placeholder="입력 후 완료를 눌러주세요"
                className="w-full px-4 py-4 bg-[#F7F8F9] rounded-2xl mb-8 outline-none border-2 border-transparent focus:border-[#3CDCBA] text-[16px] font-bold text-center"
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowAllergyModal(false); setShowDislikedFoodModal(false); }} className="flex-1 py-4 text-gray-400 font-bold">취소</button>
                <button onClick={() => {
                  const val = showAllergyModal ? newAllergy : newDislikedFood;
                  if (val.trim()) {
                    showAllergyModal ? setAllergies([...allergies, val]) : setDislikedFoods([...dislikedFoods, val]);
                  }
                  setShowAllergyModal(false); setShowDislikedFoodModal(false);
                  setNewAllergy(""); setNewDislikedFood("");
                }} className={`flex-1 py-4 text-white rounded-xl font-bold ${showAllergyModal ? 'bg-[#3CDCBA]' : 'bg-[#FF7A5C]'}`}>추가하기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
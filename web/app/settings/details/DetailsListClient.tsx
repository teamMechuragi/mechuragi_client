"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/app/common/Footer";
import { useUser } from "@/app/context/UserContext";
import { useToast } from "@/app/common/ToastProvider";
import {
  activatePreference,
  deletePreference,
} from "@/app/api/preferenceApi";

export default function DetailsListClient() {
  const router = useRouter();
  const { preferences, refreshPreferences } = useUser();
  const { showToast } = useToast();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // 대표 입맛 토글 (1개만 활성화)
  const handleToggle = async (id: number) => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      await activatePreference(id);
      await refreshPreferences(); // Context 동기화 → preferences 자동 갱신
    } catch (error) {
      console.error("상태 변경 실패:", error);
      showToast("대표 입맛 변경에 실패했습니다.", "error");
    } finally {
      setIsToggling(false);
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!deleteTargetId || isDeleting) return;
    setIsDeleting(true);

    try {
      await deletePreference(deleteTargetId);
      setDeleteTargetId(null);
      await refreshPreferences(); // Context 동기화 → preferences 자동 갱신
      showToast("입맛이 삭제되었습니다.", "success");
    } catch (error) {
      console.error("삭제 실패:", error);
      showToast("삭제에 실패했습니다.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
      <div className="w-full max-w-md mx-auto sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-50">
        <Header title="상세정보 설정" backLink="/Home" />
      </div>

      <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-24">
        <div className="mb-8">
          <h2 className="text-[20px] font-black text-[#1A1A1A] mb-2">나의 입맛 페르소나</h2>
          {preferences.length > 0 && (
            <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
              상황에 맞는 입맛을 켜주세요. <br />
              AI가 활성화된 정보를 바탕으로 추천해 드립니다.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {preferences.length > 0 ? (
              preferences.map((pref) => (
                <motion.div
                  key={pref.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    borderColor: pref.isActive ? "#3CDCBA" : "#F9FAFB",
                    backgroundColor: pref.isActive ? "#F0FFFB" : "#FFFFFF"
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="p-5 rounded-[24px] shadow-sm flex items-center justify-between border active:scale-[0.98] transition-all"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/settings/details/edit?id=${pref.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-[16px] text-[#1A1A1A]">{pref.preferenceName}</h4>
                      {pref.isActive && (
                        <span className="px-2 py-0.5 bg-[#EFFFFB] text-[#3CDCBA] text-[10px] font-bold rounded-md">사용중</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => setDeleteTargetId(pref.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>

                    {/* 토글 버튼 */}
                    <button
                      onClick={() => handleToggle(pref.id)}
                      disabled={isToggling}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        pref.isActive ? "bg-[#3CDCBA]" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        animate={{ x: pref.isActive ? 26 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                  <span className="text-4xl">🍳</span>
                </div>
                <h3 className="text-[#1A1A1A] font-bold text-[18px] mb-2">아직 입맛이 비어있어요</h3>
                <p className="text-gray-400 text-[14px] font-medium leading-relaxed">
                  나만의 첫 번째 페르소나를 만들고<br />
                  딱 맞는 메뉴 추천을 받아보세요!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => router.push("/settings/details/new")}
            className="w-full py-5 bg-white border border-gray-100 rounded-[24px] text-[#1A1A1A] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <span className="text-[#3CDCBA] text-xl">+</span>
            <span>새로운 입맛 추가하기</span>
          </button>
        </div>
      </main>

      <Footer
        type="button"
        buttonText="설정 완료"
        onButtonClick={() => router.push("/Home")}
      />

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {deleteTargetId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteTargetId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative bg-white w-full rounded-[30px] p-8 shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h4 className="text-[18px] font-black mb-2">입맛을 삭제할까요?</h4>
              <p className="text-gray-400 text-[14px] font-medium mb-8">
                삭제하면 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-4 text-gray-400 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold active:scale-[0.98] transition-all"
                >
                  {isDeleting ? "삭제 중..." : "삭제하기"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

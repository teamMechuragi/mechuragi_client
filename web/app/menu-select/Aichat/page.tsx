"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import ExitModal from "./components/ExitModal";
import { useUser } from "@/app/context/UserContext";
import { useLoading } from "@/app/context/LoadingContext"; 
import { getChatRecommendation, type FoodRecommendationResponse, type BedrockRecommendation } from "@/app/api/recommendApi";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatPage() {
  const router = useRouter();
  const { activePreferenceDetail } = useUser();
  const { startLoading, stopLoading } = useLoading(); 
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "메추라기와 대화를 통해 메뉴를 추천받아보세요!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [lastRecommendations, setLastRecommendations] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MOCK_MODE = false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    setLoading(true);
    startLoading('AI');

    if (MOCK_MODE) {
      setTimeout(() => {
        const mockResponse = `파티에 어울리는 메뉴를 추천해 드릴게요!\n\n파티 플래터\n다양한 종류의 간식과 과일이 담긴 화려한 플래터\n\n분위기를 밝게 만들기에 딱인 메뉴예요.\n\n─────────────\n\n샤브샤브\n신선한 고기와 해산물을 넣고 끓여 먹는 음식\n\n각자 원하는 토핑을 선택해서 즐길 수 있어 좋아요.\n\n─────────────\n\n피자 파티\n언제나 파티에 잘 어울리는 피자\n\n각자가 좋아하는 토핑을 골라 즐길 수 있어서 좋죠.`;

        const assistantMessage: Message = {
          role: "assistant",
          content: mockResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        setLastRecommendations({
          recommendations: [
            { name: "파티 플래터", reason: "분위기를 밝게 만들기에 딱인 메뉴예요." },
            { name: "샤브샤브", reason: "각자 원하는 토핑을 선택해서 즐길 수 있어 좋아요." },
            { name: "피자 파티", reason: "각자가 좋아하는 토핑을 골라 즐길 수 있어서 좋죠." },
          ],
        });

        setLoading(false);
        stopLoading();
      }, 1500);
      return;
    }

    try {
      if (!activePreferenceDetail) {
        const errorMessage: Message = {
          role: "assistant",
          content: "활성화된 취향이 없습니다. 취향을 먼저 등록해주세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
        stopLoading();
        return;
      }

      const data = await getChatRecommendation({
        chatMessage: userMessage.content,
        numberOfDiners: activePreferenceDetail.numberOfDiners,
        dietStatus: activePreferenceDetail.dietStatus,
        veganOption: activePreferenceDetail.veganOption,
        spiceLevel: activePreferenceDetail.spiceLevel,
        foodTypes: activePreferenceDetail.preferredFoodTypes,
        tastes: activePreferenceDetail.preferredTastes,
        avoidedFoods: activePreferenceDetail.avoidedFoods,
        allergies: activePreferenceDetail.allergies,
      });

      setLastRecommendations(data);

      let responseText = "";
      const recommendations = data.recommendations || [];
      if (recommendations.length > 0) {
        recommendations.forEach((food: BedrockRecommendation, index: number) => {
          const menuName = food.name || "메뉴";
          responseText += `\n\n${menuName}\n\n${food.reason || ""}`;
          if (index < recommendations.length - 1) {
            responseText += "\n\n─────────────";
          }
        });
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("API 호출 실패:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    if (lastRecommendations) {
      setShowExitModal(true);
    } else {
      router.back();
    }
  };

  const handleExitConfirm = () => {
    if (lastRecommendations) {
      router.push(`/menu-select/result?data=${encodeURIComponent(JSON.stringify(lastRecommendations))}`);
    } else {
      router.back();
    }
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F2F4F7]">
      {/* 헤더 */}
      <div className="w-full max-w-sm mx-auto bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="relative flex items-center justify-center py-4 px-6">
          <button onClick={handleBackClick} className="absolute left-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-gray-800">AI 대화</h1>
            
            {/* 상태 인디케이터 (접속 중 / 생각 중) */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${loading ? "bg-amber-400" : "bg-[#00D9A0]"} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? "bg-amber-400" : "bg-[#00D9A0]"}`}></span>
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${loading ? "text-amber-500" : "text-gray-400"}`}>
                {loading ? "생각 중..." : "접속 중"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ExitModal
        isOpen={showExitModal}
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-sm mx-auto space-y-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex animate-in fade-in slide-in-from-bottom-4 duration-300 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                message.role === "user"
                  ? "bg-[#00D9A0] text-white rounded-2xl rounded-tr-sm"
                  : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="whitespace-pre-wrap break-words">
                  {message.content.split('\n').map((line, i) => {
                    const nextLine = message.content.split('\n')[i + 1];
                    const isMenuName = line.trim() && !line.includes('─────') && !line.includes('추천해') && !line.includes('메뉴를') && nextLine && nextLine.length > 10;
                    
                    if (isMenuName && line.trim().length < 20) {
                      return <div key={i} className="font-bold text-[#00D9A0] my-1">{line}</div>;
                    }
                    return <div key={i}>{line || '\u00A0'}</div>;
                  })}
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-100 w-full max-w-sm mx-auto p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메뉴를 물어보세요"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#00D9A0] focus:ring-1 focus:ring-[#00D9A0]/20 text-sm transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              inputValue.trim() && !loading
                ? "bg-[#00D9A0] hover:bg-[#00C090] shadow-lg shadow-[#00D9A0]/20 scale-100 active:scale-95"
                : "bg-gray-200"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={inputValue.trim() && !loading ? "text-white" : "text-gray-400"}>
              <path d="M3 12L21 3L12 21L10 13L3 12Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
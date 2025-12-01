"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import ExitModal from "./components/ExitModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mechuragi.kro.kr";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FoodRecommendation {
  name: string;
  description: string;
  reason: string;
  ingredients: string;
  cookingTime: string;
  difficulty: string;
}

export default function AIChatPage() {
  const router = useRouter();
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

  // 🎨 목업 모드 (디자인 확인용)
  const MOCK_MODE = true;

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

    // 🎨 목업 모드: 가짜 데이터로 응답
    if (MOCK_MODE) {
      setTimeout(() => {
        const mockResponse = `중감 남의 연을 위기가 능했편대 듣기 좋은 메뉴를 추천해 드릴게요!

파티 플래터
다양한 종류의 간식과 과일이 담긴 화려한 플래터

다양한 종류의 간식을 한 번에 즐길 수 있는 플래터는 분위기를 밝게 만들기에 딱이야. 치킨, 감자튀김, 새우, 치즈 스틱 등을 담아내게 준비해서 공유하면 누구나 즐길 수 있어.

재료: 치즈, 크래커, 포도, 딸기, 견과류
⏱️ 15분 | 👨‍🍳 난이도: 하

─────────────

사브사브 또는 쉬리
주방맛있게 날씨에 각종 신선한 고기, 해산물을 넣고 끓여 먹는 음식이지. 각자 원하는 토핑을 선택해서 즐길 수 있어 좋아.

재료: 채소, 해산물, 고기, 면, 육수
⏱️ 30분 | 👨‍🍳 난이도: 중

─────────────

피자 파티
피자는 언제나 파티 음식이 잘 맞아. 각자가 좋아하는 토핑을 골라 피자를 즐길 수 있어서 좋지.

재료: 피자 도우, 토마토 소스, 치즈, 다양한 토핑
⏱️ 25분 | 👨‍🍳 난이도: 중`;

        const assistantMessage: Message = {
          role: "assistant",
          content: mockResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        // 추천 결과 저장
        setLastRecommendations({
          message: "중감 남의 연을 위기가 능했편대 듣기 좋은 메뉴를 추천해 드릴게요!",
          recommendations: [
            {
              name: "파티 플래터",
              description: "다양한 종류의 간식과 과일이 담긴 화려한 플래터",
              reason: "다양한 종류의 간식을 한 번에 즐길 수 있는 플래터는 분위기를 밝게 만들기에 딱이야. 치킨, 감자튀김, 새우, 치즈 스틱 등을 담아내게 준비해서 공유하면 누구나 즐길 수 있어.",
              ingredients: "치즈, 크래커, 포도, 딸기, 견과류",
              cookingTime: "15분",
              difficulty: "하",
            },
            {
              name: "샤브샤브",
              description: "주방맛있게 각종 신선한 고기, 해산물을 넣고 끓여 먹는 음식",
              reason: "주방맛있게 날씨에 각종 신선한 고기, 해산물을 넣고 끓여 먹는 음식이지. 각자 원하는 토핑을 선택해서 즐길 수 있어 좋아.",
              ingredients: "채소, 해산물, 고기, 면, 육수",
              cookingTime: "30분",
              difficulty: "중",
            },
            {
              name: "피자 파티",
              description: "피자는 언제나 파티 음식이 잘 맞아",
              reason: "피자는 언제나 파티 음식이 잘 맞아. 각자가 좋아하는 토핑을 골라 피자를 즐길 수 있어서 좋지.",
              ingredients: "피자 도우, 토마토 소스, 치즈, 다양한 토핑",
              cookingTime: "25분",
              difficulty: "중",
            },
          ],
        });
        
        setLoading(false);
      }, 1500);
      return;
    }

    // 실제 API 호출
    try {
      const response = await fetch(`${API_URL}/api/ai-recommendations/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 추천 결과 저장
        setLastRecommendations(data);
        
        // AI 응답 조합: 메시지 + 추천 결과
        let responseText = data.message || "";
        
        if (data.recommendations && data.recommendations.length > 0) {
          // 추천 결과를 텍스트로 변환
          data.recommendations.forEach((food: FoodRecommendation, index: number) => {
            responseText += `\n\n${food.name}\n${food.description}\n\n${food.reason}\n\n재료: ${food.ingredients}\n⏱️ ${food.cookingTime} | 👨‍🍳 난이도: ${food.difficulty}`;
            if (index < data.recommendations.length - 1) {
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
      } else {
        const errorMessage: Message = {
          role: "assistant",
          content: "죄송합니다. 추천을 가져오는데 실패했습니다. 다시 시도해주세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    // 추천 결과가 있으면 모달 표시, 없으면 바로 뒤로가기
    if (lastRecommendations) {
      setShowExitModal(true);
    } else {
      router.back();
    }
  };

  const handleExitConfirm = () => {
    // 추천 결과 페이지로 이동
    if (lastRecommendations) {
      router.push(`/recommend/result?data=${encodeURIComponent(JSON.stringify(lastRecommendations))}`);
    } else {
      router.back();
    }
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full max-w-sm mx-auto bg-white">
        <div className="relative flex items-center justify-center py-4 px-6 border-b border-gray-100">
          <button
            onClick={handleBackClick}
            className="absolute left-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">AI 대화</h1>
        </div>
      </div>

      {/* 모달 */}
      <ExitModal
        isOpen={showExitModal}
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-sm mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#00D9A0] text-white rounded-2xl rounded-tr-sm"
                  : "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content.split('\n').map((line, i) => {
                    // 메뉴 이름 감지 (다음 줄이 설명이면 메뉴 이름)
                    const nextLine = message.content.split('\n')[i + 1];
                    const isMenuName = 
                      line.trim() && 
                      !line.includes('재료:') && 
                      !line.includes('⏱️') && 
                      !line.includes('─────') &&
                      !line.includes('추천해') &&
                      !line.includes('메뉴를') &&
                      nextLine && 
                      nextLine.length > 10 && 
                      !nextLine.includes('재료');
                    
                    if (isMenuName && line.trim().length < 20) {
                      return (
                        <div key={i}>
                          <strong className="text-[#00D9A0] font-bold">{line}</strong>
                        </div>
                      );
                    }
                    return <div key={i}>{line || '\u00A0'}</div>;
                  })}
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* 로딩 중 */}
        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 w-full max-w-sm mx-auto">
        <div className="flex items-center gap-2 p-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="입력하기"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-3xl focus:outline-none focus:bg-gray-200 text-sm transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              inputValue.trim() && !loading
                ? "bg-[#00D9A0] hover:bg-[#00C090] shadow-md"
                : "bg-gray-200"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={inputValue.trim() && !loading ? "text-white" : "text-gray-400"}
            >
              <path
                d="M3 12L21 3L12 21L10 13L3 12Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
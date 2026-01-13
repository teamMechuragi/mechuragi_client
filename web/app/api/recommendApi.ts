/**
 * 추천 관련 API (별도 추천 서버 사용)
 */
import { RECOMMEND_BASE_URL } from './apiClient';

// ============================================
// 타입 정의
// ============================================

export interface RecommendRequest {
  type: 'FEELING' | 'WEATHER' | 'TIME' | 'INGREDIENTS' | 'CHAT';
  feeling?: string;
  weatherConditions?: string[];
  mealTime?: string;
  ingredients?: string[];
  chatMessage?: string;
  // 사용자 취향 데이터
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  dislikedFoods?: string[];
}

export interface RecommendResponse {
  restaurantName?: string;
  menuName?: string;
  name?: string;  // AI 채팅 추천 시 사용
  description: string;
  imageUrl?: string;
  rating?: number;
  distance?: number;
  reason?: string;
  // AI 채팅 추천 시 추가 필드
  ingredients?: string;
  cookingTime?: string;
  difficulty?: string;
}

export interface ChatRecommendRequest {
  chatMessage: string;
  // 사용자 취향 데이터
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  dislikedFoods?: string[];
}

export interface ChatRecommendResponse {
  reply: string;
  recommendations?: RecommendResponse[];
  suggestions?: string[];
}

// ============================================
// API 함수들
// ============================================

/**
 * 추천 API 요청 (RECOMMEND_BASE_URL 사용)
 */
async function recommendRequest<T>(data: RecommendRequest | ChatRecommendRequest): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${RECOMMEND_BASE_URL}/recommend`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `추천 API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * 통합 추천 API (모든 타입 처리)
 */
export async function getRecommendation(data: RecommendRequest): Promise<RecommendResponse> {
  return recommendRequest<RecommendResponse>(data);
}

/**
 * AI 채팅으로 추천받기
 */
export async function chatRecommend(data: ChatRecommendRequest): Promise<ChatRecommendResponse> {
  const requestData: RecommendRequest = {
    type: 'CHAT',
    chatMessage: data.chatMessage,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    dislikedFoods: data.dislikedFoods,
  };

  return recommendRequest<ChatRecommendResponse>(requestData);
}

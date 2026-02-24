/**
 * 추천 관련 API (별도 추천 서버 사용)
 */
import { RECOMMEND_BASE_URL } from './apiClient';

// ============================================
// 타입 정의
// ============================================

export type RecommendationType = 'FEELING' | 'WEATHER' | 'TIME' | 'INGREDIENTS' | 'CONVERSATION';

export interface RecommendRequest {
  type: RecommendationType;
  context: string[];  // type에 따라 다른 값 (WEATHER: ["맑음", "더움"], TIME: ["아침"], etc.)
  // 사용자 취향 데이터
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

// AI가 생성한 개별 추천 항목
export interface BedrockRecommendation {
  recommendationType: RecommendationType;
  name: string;
  reason: string;
}

// API 응답 (여러 추천 항목 포함)
export interface FoodRecommendationResponse {
  recommendations: BedrockRecommendation[];
  model: string;
}

// 편의를 위한 간소화된 요청 인터페이스들
export interface WeatherRecommendRequest {
  weatherConditions: string[];
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

export interface TimeRecommendRequest {
  mealTime: string;
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

export interface FeelingRecommendRequest {
  feeling: string;
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

export interface IngredientsRecommendRequest {
  ingredients: string[];
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

export interface ChatRecommendRequest {
  chatMessage: string;
  numberOfDiners?: number;
  dietStatus?: string;
  veganOption?: string;
  spiceLevel?: string;
  foodTypes?: string[];
  tastes?: string[];
  avoidedFoods?: string[];
  allergies?: string[];
}

// ============================================
// API 함수들
// ============================================

/**
 * 추천 API 요청 (RECOMMEND_BASE_URL 사용)
 */
async function recommendRequest(data: RecommendRequest): Promise<FoodRecommendationResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${RECOMMEND_BASE_URL}/food`, {
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
 * 날씨 기반 추천
 */
export async function getWeatherRecommendation(data: WeatherRecommendRequest): Promise<FoodRecommendationResponse> {
  const requestData: RecommendRequest = {
    type: 'WEATHER',
    context: data.weatherConditions,
    numberOfDiners: data.numberOfDiners,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    avoidedFoods: data.avoidedFoods,
    allergies: data.allergies,
  };

  return recommendRequest(requestData);
}

/**
 * 시간 기반 추천
 */
export async function getTimeRecommendation(data: TimeRecommendRequest): Promise<FoodRecommendationResponse> {
  const requestData: RecommendRequest = {
    type: 'TIME',
    context: [data.mealTime],
    numberOfDiners: data.numberOfDiners,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    avoidedFoods: data.avoidedFoods,
    allergies: data.allergies,
  };

  return recommendRequest(requestData);
}

/**
 * 기분 기반 추천
 */
export async function getFeelingRecommendation(data: FeelingRecommendRequest): Promise<FoodRecommendationResponse> {
  const requestData: RecommendRequest = {
    type: 'FEELING',
    context: [data.feeling],
    numberOfDiners: data.numberOfDiners,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    avoidedFoods: data.avoidedFoods,
    allergies: data.allergies,
  };

  return recommendRequest(requestData);
}

/**
 * 재료 기반 추천
 */
export async function getIngredientsRecommendation(data: IngredientsRecommendRequest): Promise<FoodRecommendationResponse> {
  const requestData: RecommendRequest = {
    type: 'INGREDIENTS',
    context: data.ingredients,
    numberOfDiners: data.numberOfDiners,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    avoidedFoods: data.avoidedFoods,
    allergies: data.allergies,
  };

  return recommendRequest(requestData);
}

/**
 * AI 채팅으로 추천받기
 */
export async function getChatRecommendation(data: ChatRecommendRequest): Promise<FoodRecommendationResponse> {
  const requestData: RecommendRequest = {
    type: 'CONVERSATION',
    context: [data.chatMessage],
    numberOfDiners: data.numberOfDiners,
    dietStatus: data.dietStatus,
    veganOption: data.veganOption,
    spiceLevel: data.spiceLevel,
    foodTypes: data.foodTypes,
    tastes: data.tastes,
    avoidedFoods: data.avoidedFoods,
    allergies: data.allergies,
  };

  return recommendRequest(requestData);
}

/**
 * 통합 추천 API (직접 RecommendRequest 사용)
 * 레거시 지원 - 새로운 코드는 위의 타입별 함수 사용 권장
 */
export async function getRecommendation(data: RecommendRequest): Promise<FoodRecommendationResponse> {
  return recommendRequest(data);
}

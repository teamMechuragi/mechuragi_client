/**
 * 북마크(스크랩) 관련 API
 */
import { apiRequest } from './apiClient';

// 백엔드 RecommendedFoodResponse에 맞춘 타입
export interface RecommendedFoodResponse {
  id: number;
  foodName: string;
  imageUrl?: string;
  description?: string;
  reason?: string;
  isScrapped: boolean;
  createdAt: string;
}

/**
 * 모든 추천 음식 조회 (인증 필요)
 */
export async function getAllRecommendations(): Promise<RecommendedFoodResponse[]> {
  return apiRequest<RecommendedFoodResponse[]>('/ai/recommended-foods');
}

/**
 * 스크랩한 추천 음식 목록 조회 (인증 필요)
 */
export async function getScrappedFoods(): Promise<RecommendedFoodResponse[]> {
  return apiRequest<RecommendedFoodResponse[]>('/ai/recommended-foods/scrapped');
}

/**
 * 추천 음식 스크랩 추가 (인증 필요)
 */
export async function scrapFood(foodId: number): Promise<void> {
  return apiRequest<void>(`/ai/recommended-foods/${foodId}/scrap`, {
    method: 'POST',
  });
}

/**
 * 추천 음식 스크랩 취소 (인증 필요)
 */
export async function unscrapFood(foodId: number): Promise<void> {
  return apiRequest<void>(`/ai/recommended-foods/${foodId}/scrap`, {
    method: 'DELETE',
  });
}

/**
 * 북마크 관련 API
 */
import { apiRequest } from './apiClient';

// 개별 음식 응답 타입
export interface RecommendedFoodResponse {
  id: number;
  name: string;
  description?: string;
  reason?: string;
  ingredients?: string;
  cookingTime?: string;
  difficulty?: string;
  isScrapped: boolean;
  createdAt: string;
}

// 북마크된 세션 응답 타입
export interface BookmarkedSessionResponse {
  sessionId: number;
  foods: RecommendedFoodResponse[];
  createdAt: string;
}

/**
 * 북마크된 추천 세션 목록 조회 (인증 필요)
 */
export async function getBookmarkedSessions(): Promise<BookmarkedSessionResponse[]> {
  return apiRequest<BookmarkedSessionResponse[]>('/ai/recommended-foods/bookmarks');
}

/**
 * 가장 최근 추천 세션 북마크 (인증 필요)
 */
export async function bookmarkLatestSession(): Promise<void> {
  return apiRequest<void>('/ai/recommended-foods/bookmark', {
    method: 'POST',
  });
}

/**
 * 특정 추천 세션 북마크 토글 (인증 필요)
 */
export async function toggleSessionBookmark(sessionId: number): Promise<void> {
  return apiRequest<void>(`/ai/recommended-foods/sessions/${sessionId}/bookmark`, {
    method: 'POST',
  });
}

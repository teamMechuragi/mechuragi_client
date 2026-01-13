/**
 * 사용자 선호도 설정 관련 API
 */
import { apiRequest } from './apiClient';

// ============================================
// 타입 정의
// ============================================

export interface PreferenceItem {
  id: number;
  preferenceName: string;
  isActive: boolean;
}

// 백엔드 Enum 타입들
export type DietStatus = '다이어트_중' | '해당_없음';
export type VeganOption = '락토_베지테리언' | '락토_오보_베지테리언' | '비건' | '오보_베지테리언' |
                          '페스코_베지테리언' | '폴로_베지테리언' | '프루테리언' | '플렉시테리언' | '해당없음';
export type SpiceLevel = '맵찔이' | '순한맛' | '신라면' | '불닭' | '핵불닭';
export type FoodType = '한식' | '중식' | '일식' | '양식' | '아시안' | '디저트' | '기타';
export type TasteType = '단맛' | '짠맛' | '신맛' | '쓴맛' | '감칠맛' | '고소한맛';

export interface PreferenceDetail {
  id: number;
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo: string | null;
  isOnDiet: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  dislikedFoods: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo?: string;
  isOnDiet: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  dislikedFoods?: string[];
}

export interface UpdatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo?: string;
  isOnDiet: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  dislikedFoods?: string[];
}

// ============================================
// API 함수들
// ============================================

/**
 * 내 선호도 목록 조회
 */
export async function getPreferences(): Promise<PreferenceItem[]> {
  return apiRequest<PreferenceItem[]>('/preferences');
}

/**
 * 선호도 상세 조회
 */
export async function getPreference(preferenceId: number): Promise<PreferenceDetail> {
  return apiRequest<PreferenceDetail>(`/preferences/${preferenceId}`);
}

/**
 * 선호도 생성
 */
export async function createPreference(data: CreatePreferenceRequest): Promise<PreferenceDetail> {
  return apiRequest<PreferenceDetail>('/preferences', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 선호도 수정
 */
export async function updatePreference(
  preferenceId: number,
  data: UpdatePreferenceRequest
): Promise<PreferenceDetail> {
  return apiRequest<PreferenceDetail>(`/preferences/${preferenceId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 선호도 삭제
 */
export async function deletePreference(preferenceId: number): Promise<void> {
  return apiRequest<void>(`/preferences/${preferenceId}`, {
    method: 'DELETE',
  });
}

/**
 * 선호도 활성화 토글
 */
export async function activatePreference(preferenceId: number): Promise<void> {
  return apiRequest<void>(`/preferences/${preferenceId}/toggle-active`, {
    method: 'PATCH',
  });
}

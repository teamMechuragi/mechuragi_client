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
export type DietStatus = 'NONE' | 'WEIGHT_LOSS' | 'BULKING' | 'MAINTENANCE';
export type VeganOption = 'NONE' | 'VEGAN' | 'VEGETARIAN' | 'PESCATARIAN' | 'FLEXITARIAN';
export type SpiceLevel = 'VERY_MILD' | 'MILD' | 'MEDIUM' | 'HOT' | 'EXTREME';
export type FoodType = '한식' | '중식' | '일식' | '양식' | '아시안' | '디저트' | '기타';
export type TasteType = '단맛' | '짠맛' | '신맛' | '쓴맛' | '감칠맛' | '고소한맛';

export interface PreferenceDetail {
  id: number;
  preferenceName: string;
  numberOfDiners: number;
  dietStatus: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  avoidedFoods: string[];
  allergies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  dietStatus: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  avoidedFoods?: string[];
  allergies?: string[];
}

export interface UpdatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  dietStatus: DietStatus;
  veganOption: VeganOption;
  spiceLevel: SpiceLevel;
  preferredFoodTypes: FoodType[];
  preferredTastes: TasteType[];
  avoidedFoods?: string[];
  allergies?: string[];
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

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

export interface PreferenceDetail {
  id: number;
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo: string | null;
  isOnDiet: string;
  veganOption: string;
  spiceLevel: string;
  preferredFoodTypes: string[];
  preferredTastes: string[];
  dislikedFoods: string[];
}

export interface CreatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo?: string;
  isOnDiet: string;
  veganOption: string;
  spiceLevel: string;
  preferredFoodTypes: string[];
  preferredTastes: string[];
  dislikedFoods?: string[];
}

export interface UpdatePreferenceRequest {
  preferenceName: string;
  numberOfDiners: number;
  allergyInfo?: string;
  isOnDiet: string;
  veganOption: string;
  spiceLevel: string;
  preferredFoodTypes: string[];
  preferredTastes: string[];
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

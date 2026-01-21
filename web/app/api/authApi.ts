/**
 * 인증 관련 API
 */
import { apiRequest, apiRequestPublic } from './apiClient';

// ============================================
// 타입 정의
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  member: {
    id: number;
    nickname: string;
    email: string;
    emailVerified: boolean;
    provider: string;
    role: string;
    status: string;
  };
}

// ============================================
// API 함수들
// ============================================

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiRequestPublic<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 로그아웃 (인증 필요)
 */
export async function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  return apiRequestPublic<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

/**
 * 회원 정보 관련 API
 */
import { apiRequest, apiRequestPublic } from './apiClient';

// ============================================
// 타입 정의
// ============================================

export interface MemberResponse {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  provider: string;
  role: string;
  status: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

// ============================================
// API 함수들
// ============================================

/**
 * 내 정보 조회 (인증 필요)
 */
export async function getMyInfo(): Promise<MemberResponse> {
  return apiRequest<MemberResponse>('/members/me');
}

/**
 * 내 닉네임 변경 (인증 필요)
 */
export async function updateNickname(data: UpdateNicknameRequest): Promise<MemberResponse> {
  return apiRequest<MemberResponse>('/members/me/nickname', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 내 프로필 이미지 변경 (인증 필요)
 */
export async function updateProfileImage(
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<void>('/members/me/profile-image', {
    method: 'PATCH',
    body: formData,
  });
}



/**
 * 비밀번호 변경
 */
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  return apiRequest<void>('/members/me/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 회원 탈퇴 (인증 필요)
 */
export async function withdrawal(): Promise<void> {
  return apiRequest<void>('/members/me', {
    method: 'DELETE',
  });
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiRequestPublic<SignupResponse>('/members/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 이메일 중복 확인
 * @returns true: 중복(사용불가), false: 사용가능
 */
export async function checkEmail(email: string): Promise<boolean> {
  return apiRequestPublic<boolean>(`/members/check/email?email=${encodeURIComponent(email)}`);
}

/**
 * 닉네임 중복 확인
 * @returns true: 중복(사용불가), false: 사용가능
 */
export async function checkNickname(nickname: string): Promise<boolean> {
  return apiRequestPublic<boolean>(`/members/check/nickname?nickname=${encodeURIComponent(nickname)}`);
}


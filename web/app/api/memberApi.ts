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

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
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
 * 내 정보 조회
 */
export async function getMyInfo(): Promise<MemberResponse> {
  return apiRequest<MemberResponse>('/members/me');
}

/**
 * 특정 회원 정보 조회
 */
export async function getMember(memberId: number): Promise<MemberResponse> {
  return apiRequest<MemberResponse>(`/members/${memberId}`);
}

/**
 * 프로필 수정
 */
export async function updateProfile(data: UpdateProfileRequest, memberId?: number): Promise<MemberResponse> {
  const endpoint = memberId ? `/members/${memberId}` : '/members/me/profile';
  return apiRequest<MemberResponse>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
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
 * 회원 탈퇴
 */
export async function withdrawal(memberId?: number): Promise<void> {
  const endpoint = memberId ? `/members/${memberId}` : '/members/me';
  return apiRequest<void>(endpoint, {
    method: 'DELETE',
  });
}

// 프로필 이미지 업로드는 imageApi.ts로 이동
export { uploadProfileImage } from './imageApi';

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

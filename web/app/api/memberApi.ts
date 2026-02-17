/**
 * 회원 정보 관련 API
 */
import { apiRequest, apiRequestPublic, API_BASE_URL } from './apiClient';
import imageCompression from 'browser-image-compression';

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

export interface UpdateNotificationSettingRequest{
  enabled: boolean;
}

export interface NotificationSettingResponse{
  enabled: boolean;
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

// 인증 필요 api

/**
 * 내 정보 조회 
 */
export async function getMyInfo(): Promise<MemberResponse> {
  return apiRequest<MemberResponse>('/members/me');
}

/**
 * 내 닉네임 변경 
 */
export async function updateNickname(data: UpdateNicknameRequest): Promise<MemberResponse> {
  return apiRequest<MemberResponse>('/members/me/nickname', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 이미지 압축 옵션
 */
const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
};

/**
 * 프로필 이미지 업로드용 Pre-signed URL 발급
 */
async function getProfilePresignedUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; imageUrl: string }> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `${API_BASE_URL}/members/me/profile-image/presigned-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Pre-signed URL 발급 실패');
  }

  return response.json();
}

/**
 * 내 프로필 이미지 변경 (Pre-signed URL 방식)
 * 1. 이미지 압축
 * 2. Pre-signed URL 발급
 * 3. S3에 직접 업로드
 * 4. 서버에 imageUrl 전달
 */
export async function updateProfileImage(file: File): Promise<void> {
  // 1. 이미지 압축
  let compressedFile: File;
  try {
    compressedFile = await imageCompression(file, compressionOptions);
  } catch (error) {
    console.warn('이미지 압축 실패, 원본 사용:', error);
    compressedFile = file;
  }

  // 2. Pre-signed URL 발급
  const { uploadUrl, imageUrl } = await getProfilePresignedUrl(
    file.name.replace(/\.[^/.]+$/, '.jpg'),
    'image/jpeg'
  );

  // 3. S3에 직접 업로드
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: compressedFile,
  });

  if (!uploadResponse.ok) {
    throw new Error('S3 업로드 실패');
  }

  // 4. 서버에 imageUrl 전달
  await apiRequest<void>('/members/me/profile-image', {
    method: 'PATCH',
    body: JSON.stringify({ imageUrl }),
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
 * 내 알림 설정 상태 조회
 */
export async function getNotificationSetting(): Promise<NotificationSettingResponse> {
  return apiRequest<NotificationSettingResponse>('/members/me/notification-setting');
}

// 내 알림 설정 상태 변경(토글)
export async function updateNotificationSetting(data: UpdateNotificationSettingRequest): Promise<void> {
  return apiRequest<void>('/members/me/notification-setting', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}    


/**
 * 회원 탈퇴
 */
export async function withdrawal(): Promise<void> {
  return apiRequest<void>('/members/me', {
    method: 'DELETE',
  });
}

// 인증 필요없는 api

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


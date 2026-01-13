/**
 * 이미지 업로드 관련 API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr/api';

// ============================================
// 타입 정의
// ============================================

export interface ImageUploadResponse {
  id: string;
  url: string;
  name: string;
}

// ============================================
// API 함수들
// ============================================

/**
 * 이미지 업로드 (여러 개)
 */
export async function uploadImages(files: File[]): Promise<ImageUploadResponse[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API Request] POST ${API_BASE_URL}/images/upload`);

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  console.log(`[API Response] ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `이미지 업로드 실패: ${response.status}`;
    console.error(`[API Error] ${errorMessage}`, errorData);
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * 단일 이미지 업로드
 */
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const results = await uploadImages([file]);
  return results[0];
}

/**
 * 프로필 이미지 업로드
 */
export async function uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API Request] POST ${API_BASE_URL}/members/upload-image`);

  const response = await fetch(`${API_BASE_URL}/members/upload-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  console.log(`[API Response] ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || '이미지 업로드 실패';
    console.error(`[API Error] ${errorMessage}`, errorData);
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * 먹방 일기 API
 */

import { apiRequest, API_BASE_URL } from './apiClient';
import imageCompression from 'browser-image-compression';

export interface DiaryRequest {
  title: string;
  content: string;
  rating: number;
  diaryDate: string; // ISO 8601 format: YYYY-MM-DD
  imageUrls: string[];
  tags: string[];
}

export interface DiaryResponse {
  id: number;
  title: string;
  content: string;
  rating: number;
  diaryDate: string;
  images: { id: number; imageUrl: string; displayOrder: number }[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryCalendarResponse {
  year: number;
  month: number;
  diaries: {
    diaryId: number;
    diaryDate: string;
    thumbnails: string[];
  }[];
}

/**
 * 일기 등록
 */
export async function createDiary(request: DiaryRequest): Promise<DiaryResponse> {
  return apiRequest<DiaryResponse>('/diaries', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * 캘린더 월별 조회
 */
export async function getMonthlyDiaries(year: number, month: number): Promise<DiaryCalendarResponse> {
  return apiRequest<DiaryCalendarResponse>(`/diaries/calendar?year=${year}&month=${month}`);
}

/**
 * 일기 상세 조회
 */
export async function getDiaryDetail(diaryId: number): Promise<DiaryResponse> {
  return apiRequest<DiaryResponse>(`/diaries/${diaryId}`);
}

/**
 * 일기 수정
 */
export async function updateDiary(
  diaryId: number,
  request: Omit<DiaryRequest, 'diaryDate'>
): Promise<DiaryResponse> {
  return apiRequest<DiaryResponse>(`/diaries/${diaryId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

/**
 * 일기 삭제
 */
export async function deleteDiary(diaryId: number): Promise<void> {
  return apiRequest<void>(`/diaries/${diaryId}`, {
    method: 'DELETE',
  });
}

/**
 * 이미지 압축 옵션
 */
const compressionOptions = {
  maxSizeMB: 1,           // 최대 1MB
  maxWidthOrHeight: 1920, // 최대 해상도
  useWebWorker: true,     // 백그라운드 처리로 UI 블로킹 방지
  fileType: 'image/jpeg', // JPEG로 변환 (압축률 좋음)
};

/**
 * 일기 이미지 업로드용 Pre-signed URL 발급
 */
async function getPresignedUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; imageUrl: string }> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `${API_BASE_URL}/diaries/presigned-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`,
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
 * 이미지 업로드 (Pre-signed URL 방식 + 이미지 압축)
 * 1. 클라이언트에서 이미지 압축
 * 2. 서버에서 Pre-signed URL 발급
 * 3. S3에 직접 업로드
 * 4. CDN URL 반환
 */
export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  // 1. 이미지 압축
  let compressedFile: File;
  try {
    compressedFile = await imageCompression(file, compressionOptions);
    console.log(`이미지 압축: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
  } catch (error) {
    console.warn('이미지 압축 실패, 원본 사용:', error);
    compressedFile = file;
  }

  // 2. Pre-signed URL 발급
  const { uploadUrl, imageUrl } = await getPresignedUploadUrl(
    file.name.replace(/\.[^/.]+$/, '.jpg'), // 확장자를 jpg로 변경
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
    throw new Error('이미지 업로드 실패');
  }

  // 4. CDN URL 반환
  return { imageUrl };
}

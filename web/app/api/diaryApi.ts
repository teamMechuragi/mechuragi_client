/**
 * 먹방 일기 API
 */

import { apiRequest } from './apiClient';

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
 * 이미지 업로드
 */
export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diaries/upload-image`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return await response.json();
}

/**
 * 투표(커뮤니티) 관련 API
 */
import { apiRequest, apiRequestPublic, API_BASE_URL } from './apiClient';
import imageCompression from 'browser-image-compression';
import type {
  VoteResponse,
  PageResponse,
  VoteCreateRequest,
  VoteUpdateRequest,
  VoteParticipationRequest,
  VoteParticipationResponse,
  VoteCommentResponse,
  VoteCommentCreateRequest,
  VoteCommentUpdateRequest,
  PopularMenuResponse,
} from '@/types/vote';

// ============================================
// 투표 게시글 API
// ============================================

/**
 * 투표 생성
 */
export async function createVote(data: VoteCreateRequest): Promise<VoteResponse> {
  return apiRequest<VoteResponse>('/votes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 투표 상세 조회
 */
export async function getVote(voteId: number): Promise<VoteResponse> {
  return apiRequestPublic<VoteResponse>(`/votes/${voteId}`);
}

/**
 * 활성화된 투표 목록 조회 (페이징)
 */
export async function getActiveVotes(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<VoteResponse>> {
  return apiRequestPublic<PageResponse<VoteResponse>>(`/votes/active?page=${page}&size=${size}`);
}

/**
 * 인기 투표 Top 10 조회
 */
export async function getHotVotes(size: number = 10): Promise<VoteResponse[]> {
  return apiRequestPublic<VoteResponse[]>(`/votes/hot?size=${size}`);
}

/**
 * 종료된 투표 목록 조회 (페이징)
 */
export async function getCompletedVotes(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<VoteResponse>> {
  return apiRequestPublic<PageResponse<VoteResponse>>(`/votes/completed?page=${page}&size=${size}`);
}

/**
 * 내가 작성한 투표 목록 조회 (인증 필요)
 */
export async function getMyVotes(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<VoteResponse>> {
  return apiRequest<PageResponse<VoteResponse>>(`/votes/my?page=${page}&size=${size}`);
}

/**
 * 투표 수정 (인증 필요) - 제목, 설명, 마감일만 수정 가능
 */
export async function updateVote(voteId: number, data: VoteUpdateRequest): Promise<VoteResponse> {
  return apiRequest<VoteResponse>(`/votes/${voteId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 투표 삭제 (인증 필요)
 */
export async function deleteVote(voteId: number): Promise<void> {
  return apiRequest<void>(`/votes/${voteId}`, {
    method: 'DELETE',
  });
}

/**
 * 이미지 업로드용 Pre-signed URL 발급
 */
async function getPresignedUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; imageUrl: string }> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `${API_BASE_URL}/votes/presigned-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`,
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
 * 이미지 압축 옵션
 */
const compressionOptions = {
  maxSizeMB: 1,           // 최대 1MB
  maxWidthOrHeight: 1920, // 최대 해상도
  useWebWorker: true,     // 백그라운드 처리로 UI 블로킹 방지
  fileType: 'image/jpeg', // JPEG로 변환 (압축률 좋음)
};

/**
 * 투표 이미지 업로드 (Pre-signed URL 방식 + 이미지 압축)
 * 1. 클라이언트에서 이미지 압축
 * 2. 서버에서 Pre-signed URL 발급
 * 3. S3에 직접 업로드
 * 4. CDN URL 반환
 */
export async function uploadVoteImage(file: File): Promise<{ imageUrl: string }> {
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

// ============================================
// 투표 참여 API
// ============================================

/**
 * 투표 참여 (인증 필요)
 */
export async function participateVote(
  data: VoteParticipationRequest
): Promise<VoteParticipationResponse> {
  return apiRequest<VoteParticipationResponse>('/votes/participate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 투표 취소 (인증 필요)
 */
export async function cancelParticipation(voteId: number): Promise<void> {
  return apiRequest<void>(`/votes/${voteId}/participate`, {
    method: 'DELETE',
  });
}

/**
 * 내 투표 참여 상태 조회 (인증 필요)
 */
export async function getMyParticipation(voteId: number): Promise<VoteParticipationResponse> {
  return apiRequest<VoteParticipationResponse>(`/votes/${voteId}/my-participation`);
}

/**
 * 투표 참여 여부 확인 (인증 필요)
 */
export async function hasParticipated(voteId: number): Promise<{ participated: boolean }> {
  return apiRequest<{ participated: boolean }>(`/votes/${voteId}/participated`);
}

// ============================================
// 댓글 API
// ============================================

/**
 * 댓글 작성 (인증 필요)
 */
export async function createComment(data: VoteCommentCreateRequest): Promise<VoteCommentResponse> {
  return apiRequest<VoteCommentResponse>('/votes/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 댓글 목록 조회 (페이징)
 */
export async function getComments(
  voteId: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<VoteCommentResponse>> {
  return apiRequestPublic<PageResponse<VoteCommentResponse>>(
    `/votes/${voteId}/comments?page=${page}&size=${size}`
  );
}

/**
 * 댓글 수정 (인증 필요)
 */
export async function updateComment(
  commentId: number,
  data: VoteCommentUpdateRequest
): Promise<VoteCommentResponse> {
  return apiRequest<VoteCommentResponse>(`/votes/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 댓글 삭제 (인증 필요)
 */
export async function deleteComment(commentId: number): Promise<void> {
  return apiRequest<void>(`/votes/comments/${commentId}`, {
    method: 'DELETE',
  });
}

/**
 * 댓글 수 조회
 */
export async function getCommentCount(voteId: number): Promise<{ count: number }> {
  return apiRequestPublic<{ count: number }>(`/votes/${voteId}/comments/count`);
}

// ============================================
// 좋아요 API
// ============================================

/**
 * 좋아요 토글 (인증 필요)
 */
export async function toggleLike(voteId: number): Promise<{ liked: boolean }> {
  return apiRequest<{ liked: boolean }>(`/votes/${voteId}/like`, {
    method: 'POST',
  });
}

/**
 * 좋아요 여부 조회 (인증 필요)
 */
export async function isLiked(voteId: number): Promise<{ liked: boolean }> {
  return apiRequest<{ liked: boolean }>(`/votes/${voteId}/liked`);
}

/**
 * 좋아요 수 조회
 */
export async function getLikeCount(voteId: number): Promise<{ count: number }> {
  return apiRequestPublic<{ count: number }>(`/votes/${voteId}/likes/count`);
}

// ============================================
// 기타 API
// ============================================

/**
 * 커뮤니티상 인기 메뉴 조회
 */
export async function getPopularMenus(): Promise<PopularMenuResponse[]> {
  return apiRequestPublic<PopularMenuResponse[]>('/votes/popular-menus');
}

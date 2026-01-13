/**
 * 투표(커뮤니티) 관련 API
 */
import { apiRequest, apiRequestPublic, API_BASE_URL } from './apiClient';
import type {
  VoteResponse,
  PageResponse,
  VoteCreateRequest,
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
 * 투표 수정 (인증 필요)
 */
export async function updateVote(voteId: number, data: VoteCreateRequest): Promise<VoteResponse> {
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
 * 투표 이미지 업로드
 */
export async function uploadVoteImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}/votes/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드 실패');
  }

  return response.json();
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

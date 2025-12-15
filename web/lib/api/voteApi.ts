import axios from 'axios';
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

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 에러 처리 로직 추가
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// 투표 게시글 API
// ============================================

/**
 * 투표 생성
 */
export const createVote = async (data: VoteCreateRequest): Promise<VoteResponse> => {
  const response = await apiClient.post<VoteResponse>('/votes', data);
  return response.data;
};

/**
 * 투표 상세 조회
 */
export const getVote = async (voteId: number): Promise<VoteResponse> => {
  const response = await apiClient.get<VoteResponse>(`/votes/${voteId}`);
  return response.data;
};

/**
 * 활성화된 투표 목록 조회 (페이징)
 */
export const getActiveVotes = async (page: number = 0, size: number = 10): Promise<PageResponse<VoteResponse>> => {
  const response = await apiClient.get<PageResponse<VoteResponse>>('/votes/active', {
    params: { page, size },
  });
  return response.data;
};

/**
 * 인기 투표 Top 10 조회
 */
export const getHotVotes = async (size: number = 10): Promise<VoteResponse[]> => {
  const response = await apiClient.get<VoteResponse[]>('/votes/hot', {
    params: { size },
  });
  return response.data;
};

/**
 * 종료된 투표 목록 조회 (페이징)
 */
export const getCompletedVotes = async (page: number = 0, size: number = 10): Promise<PageResponse<VoteResponse>> => {
  const response = await apiClient.get<PageResponse<VoteResponse>>('/votes/completed', {
    params: { page, size },
  });
  return response.data;
};

/**
 * 내가 작성한 투표 목록 조회 (인증 필요)
 */
export const getMyVotes = async (page: number = 0, size: number = 10): Promise<PageResponse<VoteResponse>> => {
  const response = await apiClient.get<PageResponse<VoteResponse>>('/votes/my', {
    params: { page, size },
  });
  return response.data;
};

/**
 * 투표 수정 (인증 필요)
 */
export const updateVote = async (voteId: number, data: VoteCreateRequest): Promise<VoteResponse> => {
  const response = await apiClient.put<VoteResponse>(`/votes/${voteId}`, data);
  return response.data;
};

/**
 * 투표 삭제 (인증 필요)
 */
export const deleteVote = async (voteId: number): Promise<void> => {
  await apiClient.delete(`/votes/${voteId}`);
};

/**
 * 투표 이미지 업로드
 */
export const uploadVoteImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ imageUrl: string }>('/votes/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============================================
// 투표 참여 API
// ============================================

/**
 * 투표 참여 (인증 필요)
 */
export const participateVote = async (data: VoteParticipationRequest): Promise<VoteParticipationResponse> => {
  const response = await apiClient.post<VoteParticipationResponse>('/votes/participate', data);
  return response.data;
};

/**
 * 투표 취소 (인증 필요)
 */
export const cancelParticipation = async (voteId: number): Promise<void> => {
  await apiClient.delete(`/votes/${voteId}/participate`);
};

/**
 * 내 투표 참여 상태 조회 (인증 필요)
 */
export const getMyParticipation = async (voteId: number): Promise<VoteParticipationResponse> => {
  const response = await apiClient.get<VoteParticipationResponse>(`/votes/${voteId}/my-participation`);
  return response.data;
};

/**
 * 투표 참여 여부 확인 (인증 필요)
 */
export const hasParticipated = async (voteId: number): Promise<{ participated: boolean }> => {
  const response = await apiClient.get<{ participated: boolean }>(`/votes/${voteId}/participated`);
  return response.data;
};

// ============================================
// 댓글 API
// ============================================

/**
 * 댓글 작성 (인증 필요)
 */
export const createComment = async (data: VoteCommentCreateRequest): Promise<VoteCommentResponse> => {
  const response = await apiClient.post<VoteCommentResponse>('/votes/comments', data);
  return response.data;
};

/**
 * 댓글 목록 조회 (페이징)
 */
export const getComments = async (voteId: number, page: number = 0, size: number = 20): Promise<PageResponse<VoteCommentResponse>> => {
  const response = await apiClient.get<PageResponse<VoteCommentResponse>>(`/votes/${voteId}/comments`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * 댓글 수정 (인증 필요)
 */
export const updateComment = async (commentId: number, data: VoteCommentUpdateRequest): Promise<VoteCommentResponse> => {
  const response = await apiClient.put<VoteCommentResponse>(`/votes/comments/${commentId}`, data);
  return response.data;
};

/**
 * 댓글 삭제 (인증 필요)
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await apiClient.delete(`/votes/comments/${commentId}`);
};

/**
 * 댓글 수 조회
 */
export const getCommentCount = async (voteId: number): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>(`/votes/${voteId}/comments/count`);
  return response.data;
};

// ============================================
// 좋아요 API
// ============================================

/**
 * 좋아요 토글 (인증 필요)
 */
export const toggleLike = async (voteId: number): Promise<{ liked: boolean }> => {
  const response = await apiClient.post<{ liked: boolean }>(`/votes/${voteId}/like`);
  return response.data;
};

/**
 * 좋아요 여부 조회 (인증 필요)
 */
export const isLiked = async (voteId: number): Promise<{ liked: boolean }> => {
  const response = await apiClient.get<{ liked: boolean }>(`/votes/${voteId}/liked`);
  return response.data;
};

/**
 * 좋아요 수 조회
 */
export const getLikeCount = async (voteId: number): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>(`/votes/${voteId}/likes/count`);
  return response.data;
};

// ============================================
// 기타 API
// ============================================

/**
 * 커뮤니티상 인기 메뉴 조회
 */
export const getPopularMenus = async (): Promise<PopularMenuResponse[]> => {
  const response = await apiClient.get<PopularMenuResponse[]>('/votes/popular-menus');
  return response.data;
};

// 투표 상태
export type VoteStatus = 'ACTIVE' | 'COMPLETED';

// 투표 옵션 응답
export interface VoteOptionResponse {
  id: number;
  optionText: string;
  imageUrl: string | null;
  voteCount: number;
  votePercentage: number;
  displayOrder: number;
}

// 투표 응답
export interface VoteResponse {
  id: number;
  title: string;
  description: string | null;
  deadline: string; // ISO 8601 형식
  status: VoteStatus;
  allowMultipleChoice: boolean;
  totalParticipants: number;
  totalLikes: number;
  authorName: string;
  createdAt: string; // ISO 8601 형식
  options: VoteOptionResponse[];
}

// 페이지네이션 응답
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 투표 생성 요청
export interface VoteCreateRequest {
  title: string;
  description?: string;
  deadline: string; // ISO 8601 형식
  allowMultipleChoice?: boolean;
  options: VoteOptionRequest[];
}

// 투표 옵션 요청
export interface VoteOptionRequest {
  optionText: string;
  imageUrl?: string;
}

// 투표 참여 요청
export interface VoteParticipationRequest {
  voteId: number;
  optionIds: number[];
}

// 투표 참여 응답
export interface VoteParticipationResponse {
  voteId: number;
  voteTitle: string;
  participatedOptions: Array<{
    optionId: number;
    optionText: string;
    imageUrl?: string;
  }>;
  participatedAt: string | null; // ISO 8601 형식
}

// 댓글 응답
export interface VoteCommentResponse {
  id: number;
  voteId: number;
  content: string;
  authorName: string;
  authorId: number;
  createdAt: string; // ISO 8601 형식
  updatedAt: string | null; // ISO 8601 형식
}

// 댓글 작성 요청
export interface VoteCommentCreateRequest {
  voteId: number;
  content: string;
}

// 댓글 수정 요청
export interface VoteCommentUpdateRequest {
  content: string;
}

// 인기 메뉴 응답
export interface PopularMenuResponse {
  menu: string;                    // 메뉴명
  score: number;                   // 최종 점수
  mentionCount: number;            // 언급 횟수
  averageVotePercentage: number;   // 평균 투표율 (실시간)
  averageRecency: number;          // 평균 최근성
}

// 백엔드 VoteNotificationType과 일치
export type VoteNotificationType = 'COMPLETED' | 'ENDING_SOON';

// 백엔드 NotificationResponseDTO와 일치
export interface Notification {
  id: number;
  voteId: number;
  title: string;
  type: VoteNotificationType;
  isRead: boolean;
  createdAt: string; // ISO 8601 string
  readAt: string | null;
}

// SSE로 전달되는 실시간 알림 메시지 (VoteNotificationMessageDTO)
export interface VoteNotificationMessage {
  voteId: number;
  title: string;
  type: VoteNotificationType;
  timestamp: string; // ISO 8601 string
  memberId: number;
}

// 안 읽은 알림 개수 응답
export interface UnreadCountResponse {
  unreadCount: number;
}

// Spring Page 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
import { apiRequest } from './apiClient';
import type {
  Notification,
  PageResponse,
  UnreadCountResponse
} from '@/app/types/notification';

export const notificationApi = {
  /**
   * 알림 목록 조회 (페이징)
   */
  async getNotifications(page = 0, size = 20): Promise<PageResponse<Notification>> {
    return apiRequest<PageResponse<Notification>>(
      `/notifications?page=${page}&size=${size}`
    );
  },

  /**
   * 특정 알림 읽음 처리
   */
  async markAsRead(notificationId: number): Promise<void> {
    return apiRequest<void>(
      `/notifications/${notificationId}/read`,
      { method: 'PATCH' }
    );
  },

  /**
   * 안 읽은 알림 개수 조회
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiRequest<UnreadCountResponse>('/notifications/unread-count');
  },
};

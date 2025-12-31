// TODO: 백엔드 API 연동 시 이 파일 사용

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const notificationApi = {
  // TODO: 백엔드 API - 알림 목록 가져오기
  async getNotifications() {
    // 백엔드 API 연동 전에는 localStorage 사용
    const notifications = localStorage.getItem('notifications');
    return notifications ? JSON.parse(notifications) : [];
    
    /* 백엔드 API 연동 후:
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
    return await response.json();
    */
  },

  // TODO: 백엔드 API - 알림 읽음 처리
  async markAsRead(notificationId: string) {
    // 백엔드 API 연동 전에는 localStorage 사용
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map((n: any) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    
    /* 백엔드 API 연동 후:
    await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
    */
  },

  // TODO: 백엔드 API - 모든 알림 읽음 처리
  async markAllAsRead() {
    // 백엔드 API 연동 전에는 localStorage 사용
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map((n: any) => ({ ...n, isRead: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    
    /* 백엔드 API 연동 후:
    await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
    */
  },

  // TODO: 백엔드 API - 알림 설정 저장
  async updateSettings(settings: { ticketResults: boolean; top10Results: boolean }) {
    // 백엔드 API 연동 전에는 localStorage 사용
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    /* 백엔드 API 연동 후:
    await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    */
  },

  // TODO: 백엔드 API - 알림 설정 가져오기
  async getSettings() {
    // 백엔드 API 연동 전에는 localStorage 사용
    const settings = localStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : { ticketResults: false, top10Results: false };
    
    /* 백엔드 API 연동 후:
    const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });
    return await response.json();
    */
  },
};

// TODO: 백엔드 API - 액세스 토큰 가져오기 (로그인 시스템과 연동)
function getAccessToken() {
  return localStorage.getItem('accessToken') || '';
}
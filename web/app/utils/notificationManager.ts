import type { Notification } from '@/app/types/notification';

export const notificationManager = {
  // 알림 추가
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };
    
    notifications.unshift(newNotification); // 최신 알림을 앞에 추가
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // 알림 업데이트 이벤트 발생
    window.dispatchEvent(new Event('notificationsUpdated'));
    
    return newNotification;
  },

  // 알림 목록 가져오기
  getNotifications(): Notification[] {
    const notifications = localStorage.getItem('notifications');
    if (!notifications) return [];
    
    return JSON.parse(notifications).map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  },

  // 알림 읽음 처리
  markAsRead(notificationId: string) {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationsUpdated'));
  },

  // 모든 알림 읽음 처리
  markAllAsRead() {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true,
    }));
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    window.dispatchEvent(new Event('notificationsUpdated'));
  },

  // 안읽은 알림 개수
  getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.isRead).length;
  },
};
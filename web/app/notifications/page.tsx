// web/app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';
import { notificationApi } from '@/app/api/notificationApi'; // API 함수 import
import type { Notification } from '@/app/types/notification';

export default function NotificationsListPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // TODO: 백엔드 API - 알림 목록 불러오기
    const loadNotifications = async () => {
      const notificationList = await notificationApi.getNotifications();
      setNotifications(notificationList);
    };

    loadNotifications();

    window.addEventListener('notificationsUpdated', loadNotifications);
    return () => {
      window.removeEventListener('notificationsUpdated', loadNotifications);
    };
  }, []);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // TODO: 백엔드 API - 알림 클릭 시 읽음 처리
  const handleNotificationClick = async (notification: Notification) => {
    await notificationApi.markAsRead(notification.id);
    
    if (notification.type === 'ticket_result') {
      router.push('/community/vote-result'); // TODO: 실제 투표 ID 포함 경로로 수정
    } else if (notification.type === 'vote_ending') {
      router.push('/community');
    }
  };

  const getCategoryLabel = (type: string) => {
    if (type === 'ticket_result') return '투표 결과';
    if (type === 'vote_ending') return '투표 종료';
    return '알림';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">알림</h1>
          <button onClick={() => router.push('/mypage/notifications')}>
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="divide-y">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="mb-2">
                <span className="text-xs font-medium text-[#4ECDC4]">
                  {getCategoryLabel(notification.type)}
                </span>
              </div>
              <p className={`text-sm mb-2 ${!notification.isRead ? 'font-semibold' : ''}`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-400">
                {formatTime(notification.timestamp)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
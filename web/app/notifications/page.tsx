'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';
import { notificationApi } from '@/app/api/notificationApi';
import { useNotification } from '@/app/context/NotificationContext';
import type { Notification, VoteNotificationMessage } from '@/app/types/notification';

export default function NotificationsListPage() {
  const router = useRouter();
  const { refreshUnreadCount, isNotificationEnabled } = useNotification();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // 알림 목록 로드
  const loadNotifications = useCallback(async (pageNum = 0, append = false) => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications(pageNum);

      if (append) {
        setNotifications(prev => [...prev, ...response.content]);
      } else {
        setNotifications(response.content);
      }

      setHasMore(!response.last);
      setPage(response.number);
    } catch (error) {
      console.error('알림 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // SSE 실시간 알림 처리 (NotificationContext에서 발행된 이벤트 수신)
  const handleRealtimeNotification = useCallback((event: Event) => {
    // 알림 설정이 꺼져 있으면 무시
    if (!isNotificationEnabled) return;

    const message = (event as CustomEvent<VoteNotificationMessage>).detail;

    // 실시간 알림을 목록 상단에 추가 (서버에서 보낸 title 사용)
    // 임시 ID는 음수로 설정하여 서버 ID와 구분
    const newNotification: Notification = {
      id: -Date.now(),
      voteId: message.voteId,
      title: message.title,
      type: message.type,
      isRead: false,
      createdAt: message.timestamp,
      readAt: null,
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, [isNotificationEnabled]);

  // 글로벌 SSE 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('sse:vote-end', handleRealtimeNotification);
    window.addEventListener('sse:vote-soon', handleRealtimeNotification);

    return () => {
      window.removeEventListener('sse:vote-end', handleRealtimeNotification);
      window.removeEventListener('sse:vote-soon', handleRealtimeNotification);
    };
  }, [handleRealtimeNotification]);

  // 초기 로드
  useEffect(() => {
    loadNotifications(0);
  }, [loadNotifications]);

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 알림 클릭 시 읽음 처리 및 페이지 이동
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // 읽음 처리 (임시 ID가 아닌 경우에만 API 호출)
      if (!notification.isRead && notification.id > 0) {
        await notificationApi.markAsRead(notification.id);
        await refreshUnreadCount();
      }

      // 로컬 상태 업데이트
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );

      // 투표 페이지로 이동
      router.push(`/community/detail?id=${notification.voteId}`);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      // 에러가 발생해도 페이지 이동은 수행
      router.push(`/community/detail?id=${notification.voteId}`);
    }
  };

  // 알림 타입별 라벨
  const getCategoryLabel = (type: Notification['type']) => {
    switch (type) {
      case 'COMPLETED':
        return '투표 종료';
      case 'ENDING_SOON':
        return '마감 임박';
      default:
        return '알림';
    }
  };

  // 더 보기
  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadNotifications(page + 1, true);
    }
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
        {isLoading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#4ECDC4] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">알림을 불러오는 중...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>알림이 없습니다</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
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
                  {notification.title}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTime(notification.createdAt)}
                </p>
              </button>
            ))}

            {hasMore && (
              <div className="py-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="text-sm text-[#4ECDC4] hover:underline disabled:opacity-50"
                >
                  {isLoading ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

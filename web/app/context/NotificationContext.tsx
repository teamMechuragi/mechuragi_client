'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useUser } from '@/app/context/UserContext';
import { notificationApi } from '@/app/api/notificationApi';
import { getNotificationSetting } from '@/app/api/memberApi';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { VoteNotificationMessage } from '@/app/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SSE_MAX_RETRIES = 5;

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  isConnected: boolean;
  isNotificationEnabled: boolean;
  setIsNotificationEnabled: (enabled: boolean) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const isNotificationEnabledRef = useRef(isNotificationEnabled);

  // ref 동기화 (SSE 콜백에서 최신 상태 참조용)
  useEffect(() => {
    isNotificationEnabledRef.current = isNotificationEnabled;
  }, [isNotificationEnabled]);

  // 안 읽은 알림 개수 조회
  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // 알림 설정이 꺼져 있으면 0으로 표시
    if (!isNotificationEnabledRef.current) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('[Notification] 안 읽은 알림 개수 조회 실패:', error);
    }
  }, [user]);

  // SSE 연결 (로그인 기준으로 유지)
  const connectSSE = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || !user) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await fetchEventSource(`${API_BASE_URL}/sse/connect`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream',
        },
        signal: abortController.signal,
        onopen: async (response) => {
          if (response.ok) {
            console.log('[SSE] 연결 성공');
            setIsConnected(true);
            retryCountRef.current = 0;
          }
        },
        onmessage: (event) => {
          if (event.event === 'vote-end' || event.event === 'vote-soon') {
            try {
              const message: VoteNotificationMessage = JSON.parse(event.data);

              // 알림 설정이 켜져 있을 때만 unreadCount 증가
              if (isNotificationEnabledRef.current) {
                setUnreadCount(prev => prev + 1);
              }

              // 커스텀 이벤트는 항상 발생 (페이지에서 필요시 사용)
              window.dispatchEvent(new CustomEvent(`sse:${event.event}`, { detail: message }));
            } catch (e) {
              console.error('[SSE] 메시지 파싱 에러:', e);
            }
          }
        },
        onclose: () => {
          setIsConnected(false);
          // 정상 종료(타임아웃 포함) 시에도 재연결 시도
          if (retryCountRef.current < SSE_MAX_RETRIES) {
            retryCountRef.current += 1;
            console.log(`[SSE] 연결 종료, 재연결 시도 (${retryCountRef.current}/${SSE_MAX_RETRIES})`);
            setTimeout(() => connectSSE(), 1000 * retryCountRef.current); // 지수 백오프
          }
        },
        onerror: (error) => {
          setIsConnected(false);
          if (retryCountRef.current < SSE_MAX_RETRIES) {
            retryCountRef.current += 1;
            throw error;
          }
          abortController.abort();
        },
        openWhenHidden: true,
      });
    } catch (error) {
      console.error('[SSE] 연결 실패:', error);
    }
  }, [user]);

  const disconnectSSE = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // 로그인 시 알림 설정 불러오기
  useEffect(() => {
    if (user) {
      getNotificationSetting().then(settings => {
        setIsNotificationEnabled(settings.enabled);
      }).catch(console.error);
    } else {
      setIsNotificationEnabled(false);
    }
  }, [user]);

  // SSE 연결 관리 (로그인 기준)
  useEffect(() => {
    if (user) {
      connectSSE();
    } else {
      disconnectSSE();
      setUnreadCount(0);
    }
    return () => disconnectSSE();
  }, [user, connectSSE, disconnectSSE]);

  // 알림 설정 변경 시 unreadCount 갱신
  useEffect(() => {
    if (user) {
      refreshUnreadCount();
    }
  }, [isNotificationEnabled, user, refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        isConnected,
        isNotificationEnabled,
        setIsNotificationEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
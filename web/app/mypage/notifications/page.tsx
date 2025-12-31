// web/app/mypage/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { notificationApi } from '@/app/api/notificationApi'; // API 함수 import

export default function NotificationsPage() {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState({
    ticketResults: false,
    top10Results: false,
  });

  useEffect(() => {
    // TODO: 백엔드 API - 알림 설정 불러오기
    const loadSettings = async () => {
      const settings = await notificationApi.getSettings();
      setNotificationSettings(settings);
    };
    loadSettings();
  }, []);

  // TODO: 백엔드 API - 알림 설정 저장
  const handleToggle = async (key: 'ticketResults' | 'top10Results') => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(newSettings);
    await notificationApi.updateSettings(newSettings);
  };

  const hasDisabledNotification = !notificationSettings.ticketResults || !notificationSettings.top10Results;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">알림 설정</h1>
        </div>
      </div>

      {hasDisabledNotification && (
        <div className="mx-4 mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            ⓘ 푸시알림을 비활성화 해도 알림에서 확인 할 수 있어요.
          </p>
        </div>
      )}

      <div className="mt-4 bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="text-base">투표 결과 푸시알림</span>
          <button
            onClick={() => handleToggle('ticketResults')}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              notificationSettings.ticketResults ? 'bg-[#4ECDC4]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                notificationSettings.ticketResults ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-base">투표 종료 10분전 푸시알림</span>
          <button
            onClick={() => handleToggle('top10Results')}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              notificationSettings.top10Results ? 'bg-[#4ECDC4]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                notificationSettings.top10Results ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
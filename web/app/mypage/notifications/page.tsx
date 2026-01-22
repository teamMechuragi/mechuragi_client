'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { updateNotificationSetting } from '@/app/api/memberApi';
import { useNotification } from '@/app/context/NotificationContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { isNotificationEnabled, setIsNotificationEnabled } = useNotification();

  const handleToggle = async () => {
    const newEnabled = !isNotificationEnabled;
    
    // 1. 전역 상태 먼저 업데이트 (즉각적인 UI 반영 및 SSE 제어)
    setIsNotificationEnabled(newEnabled);
    
    try {
      // 2. 서버에 저장
      await updateNotificationSetting({ enabled: newEnabled });
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setIsNotificationEnabled(!newEnabled); // 실패 시 롤백
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4"><ArrowLeft /></button>
        <h1 className="text-lg font-semibold">알림 설정</h1>
      </div>

      <div className="mt-4 bg-white px-4 py-4 flex justify-between items-center">
        <span>투표 알림</span>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            isNotificationEnabled ? 'bg-[#4ECDC4]' : 'bg-gray-300'
          }`}
        >
          <span className={`h-5 w-5 transform rounded-full bg-white transition-transform ${
            isNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
}
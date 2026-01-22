'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { NotificationContext } from '@/app/context/NotificationContext';

interface NotificationBellProps {
  onClick?: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  // useNotification() 대신 직접 context 사용 (에러 throw 방지)
  const context = useContext(NotificationContext);
  const unreadCount = context?.unreadCount ?? 0;

  return (
    <button onClick={onClick} className="relative">
      <Image src="/icon/bell.png" alt="알림" width={24} height={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}

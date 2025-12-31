'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Notification } from '@/app/types/notification';

interface NotificationBellProps {
  onClick?: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const checkUnreadNotifications = () => {
      const notifications = localStorage.getItem('notifications');
      if (notifications) {
        const notificationList: Notification[] = JSON.parse(notifications);
        const hasUnread = notificationList.some(notification => !notification.isRead);
        setHasUnreadNotifications(hasUnread);
      } else {
        setHasUnreadNotifications(false);
      }
    };

    checkUnreadNotifications();
    window.addEventListener('storage', checkUnreadNotifications);
    window.addEventListener('notificationsUpdated', checkUnreadNotifications);

    return () => {
      window.removeEventListener('storage', checkUnreadNotifications);
      window.removeEventListener('notificationsUpdated', checkUnreadNotifications);
    };
  }, []);

  return (
    <button onClick={onClick} className="relative">
      <Image src="/icon/bell.png" alt="알림" width={24} height={24} />
      {hasUnreadNotifications && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}
import React from 'react';
import { Notification, type NotificationProps } from './Notification';
import './NotificationContainer.scss';

interface NotificationContainerProps {
  notifications: Omit<NotificationProps, 'onClose'>[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}; 
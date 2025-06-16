import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Notification.scss';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M6 10L8.5 12.5L14 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M7 7L13 13M13 7L7 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M10 6V10M10 14H10.01"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path
              d="M10 14V10M10 6H10.01"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__content">
        <span className="notification__message">{message}</span>
      </div>
      <button className="notification__close" onClick={handleClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}; 
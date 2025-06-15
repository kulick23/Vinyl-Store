import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationContainer } from '../Components/Notification/NotificationContainer';
import type { NotificationType } from '../Components/Notification/Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, messageKey: string, params?: any) => void;
  showSuccess: (messageKey: string, params?: any) => void;
  showError: (messageKey: string, params?: any) => void;
  showWarning: (messageKey: string, params?: any) => void;
  showInfo: (messageKey: string, params?: any) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((
    type: NotificationType,
    messageKey: string,
    params?: any
  ) => {
    const id = generateId();
    const message = String(t(messageKey, params));
    
    const newNotification: NotificationItem = {
      id,
      type,
      message,
      duration: type === 'error' ? 7000 : 5000, // Error messages stay longer
    };

    setNotifications(prev => [...prev, newNotification]);
  }, [t, generateId]);

  const showSuccess = useCallback((messageKey: string, params?: any) => {
    showNotification('success', messageKey, params);
  }, [showNotification]);

  const showError = useCallback((messageKey: string, params?: any) => {
    showNotification('error', messageKey, params);
  }, [showNotification]);

  const showWarning = useCallback((messageKey: string, params?: any) => {
    showNotification('warning', messageKey, params);
  }, [showNotification]);

  const showInfo = useCallback((messageKey: string, params?: any) => {
    showNotification('info', messageKey, params);
  }, [showNotification]);

  const contextValue: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </NotificationContext.Provider>
  );
}; 
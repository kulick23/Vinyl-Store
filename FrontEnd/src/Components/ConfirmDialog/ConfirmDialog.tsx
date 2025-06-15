import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmDialog.scss';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#ef4444" />
            <path
              d="M16 16L32 32M32 16L16 32"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#f59e0b" />
            <path
              d="M24 14V26M24 34H24.02"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'info':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#3b82f6" />
            <path
              d="M24 34V22M24 14H24.02"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleBackdropClick}>
      <div className="confirm-dialog">
        <div className="confirm-dialog__header">
          <div className="confirm-dialog__icon">
            {getIcon()}
          </div>
          <h2 className="confirm-dialog__title">{title}</h2>
        </div>
        
        <div className="confirm-dialog__content">
          <p className="confirm-dialog__message">{message}</p>
        </div>
        
        <div className="confirm-dialog__actions">
          <button 
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={handleCancel}
          >
            {cancelText || t('common.cancel')}
          </button>
          <button 
            className={`confirm-dialog__button confirm-dialog__button--confirm confirm-dialog__button--${type}`}
            onClick={handleConfirm}
          >
            {confirmText || t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}; 
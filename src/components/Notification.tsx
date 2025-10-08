import React, { useEffect } from 'react';

interface NotificationProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'info':
        return 'notification-info';
      default:
        return 'notification-info';
    }
  };

  return (
    <div className={`notification ${getTypeClass()}`}>
      <div className="notification-content">
        <span className="notification-icon">{getTypeIcon()}</span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
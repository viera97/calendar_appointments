import React, { useEffect } from 'react';

/**
 * Props interface for the Notification component
 */
interface NotificationProps {
  isOpen: boolean; // Whether the notification is visible
  message: string; // The message to display
  type: 'success' | 'error' | 'info'; // Type of notification affecting styling and icon
  onClose: () => void; // Callback function when notification is closed
  autoClose?: boolean; // Whether to auto-close the notification (default: true)
  duration?: number; // Duration in milliseconds before auto-close (default: 3000)
}

/**
 * Notification Component
 * 
 * This component displays toast-style notifications to provide feedback to users.
 * It supports different types (success, error, info) with appropriate styling and icons.
 * 
 * Features:
 * - Auto-close functionality with configurable duration
 * - Manual close button
 * - Different visual styles based on notification type
 * - Appropriate icons for each notification type
 * - Smooth animations and transitions
 */
const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  /**
   * Effect hook to handle auto-close functionality
   * Sets up a timer to automatically close the notification after the specified duration
   */
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Cleanup timer on component unmount or dependency change
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  // Don't render anything if notification is not open
  if (!isOpen) return null;

  /**
   * Get appropriate icon based on notification type
   */
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

  /**
   * Get appropriate CSS class based on notification type
   */
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
        {/* Icon representing the notification type */}
        <span className="notification-icon">{getTypeIcon()}</span>
        {/* Notification message text */}
        <span className="notification-message">{message}</span>
        {/* Manual close button */}
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
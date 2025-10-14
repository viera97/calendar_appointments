import { useState } from 'react';

/**
 * Custom Hook for Notification Management
 * 
 * Provides a centralized way to manage notification state and display
 * throughout the application. Handles different notification types
 * with proper state management.
 */

// Notification state interface
interface NotificationState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useNotifications = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  /**
   * Show a success notification
   * @param message - Success message to display
   */
  const showSuccess = (message: string) => {
    setNotification({
      isOpen: true,
      message,
      type: 'success'
    });
  };

  /**
   * Show an error notification
   * @param message - Error message to display
   */
  const showError = (message: string) => {
    setNotification({
      isOpen: true,
      message,
      type: 'error'
    });
  };

  /**
   * Show an info notification
   * @param message - Info message to display
   */
  const showInfo = (message: string) => {
    setNotification({
      isOpen: true,
      message,
      type: 'info'
    });
  };

  /**
   * Close the current notification
   */
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  return {
    notification,
    showSuccess,
    showError,
    showInfo,
    closeNotification
  };
};
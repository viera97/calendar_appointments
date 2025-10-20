import { useState } from 'react';

/**
 * Custom Hook for Confirm Modal Management
 * 
 * Provides a centralized way to manage confirmation modal state
 * and actions. Simplifies the process of showing confirmation dialogs
 * throughout the application.
 */

// Confirm modal state interface
interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  appointmentId: string;
  confirmText: string;
  cancelText: string;
}

export const useConfirmModal = () => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    appointmentId: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  /**
   * Show a confirmation modal
   * @param title - Modal title
   * @param message - Confirmation message
   * @param onConfirm - Callback function when user confirms
   * @param appointmentId - Optional appointment ID for context
   * @param confirmText - Optional text for confirm button
   * @param cancelText - Optional text for cancel button
   */
  const showConfirmModal = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    appointmentId: string = '',
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      appointmentId,
      confirmText,
      cancelText
    });
  };

  /**
   * Close the confirmation modal
   */
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    confirmModal,
    showConfirmModal,
    closeConfirmModal
  };
};
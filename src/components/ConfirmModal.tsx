import React from 'react';

/**
 * Confirmation Modal Component
 * 
 * A reusable modal dialog for user confirmations with support for different
 * severity types (danger, warning, info). Provides customizable buttons
 * and prevents accidental actions through overlay clicking.
 */

// Props interface for the confirmation modal component
interface ConfirmModalProps {
  isOpen: boolean;           // Controls modal visibility
  title: string;            // Modal header title
  message: string;          // Confirmation message to display
  onConfirm: () => void;    // Callback when user confirms action
  onCancel: () => void;     // Callback when user cancels action
  confirmText?: string;     // Custom confirm button text (default: "Confirmar")
  cancelText?: string;      // Custom cancel button text (default: "Cancelar")
  type?: 'danger' | 'warning' | 'info';  // Visual type for styling and icon
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',    // Default Spanish text for confirm button
  cancelText = 'Cancelar',      // Default Spanish text for cancel button
  type = 'warning'              // Default to warning type
}) => {
  // Early return if modal should not be displayed
  if (!isOpen) return null;

  /**
   * Get appropriate icon based on modal type
   * @returns Emoji icon string for the modal type
   */
  const getTypeIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';  // Delete/trash icon for dangerous actions
      case 'warning':
        return '⚠️';   // Warning triangle for cautionary actions
      case 'info':
        return 'ℹ️';   // Information icon for informational dialogs
      default:
        return '❓';   // Question mark for unknown types
    }
  };

  /**
   * Get CSS class for modal styling based on type
   * @returns CSS class string for modal styling
   */
  const getTypeClass = () => {
    switch (type) {
      case 'danger':
        return 'modal-danger';    // Red styling for dangerous actions
      case 'warning':
        return 'modal-warning';   // Yellow/orange styling for warnings
      case 'info':
        return 'modal-info';      // Blue styling for information
      default:
        return 'modal-warning';   // Default to warning styling
    }
  };

  return (
    // Overlay that covers the entire screen and closes modal when clicked
    <div className="modal-overlay" onClick={onCancel}>
      {/* Modal content container - prevents event bubbling to overlay */}
      <div className={`modal-content ${getTypeClass()}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal header with icon and title */}
        <div className="modal-header">
          <span className="modal-icon">{getTypeIcon()}</span>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        {/* Modal body with confirmation message */}
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        {/* Action buttons for user interaction */}
        <div className="modal-actions">
          {/* Cancel button - always neutral styling */}
          <button 
            className="btn-modal-cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          {/* Confirm button - styling changes based on type */}
          <button 
            className={`btn-modal-confirm ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
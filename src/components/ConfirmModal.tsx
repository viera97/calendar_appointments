import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'danger':
        return 'modal-danger';
      case 'warning':
        return 'modal-warning';
      case 'info':
        return 'modal-info';
      default:
        return 'modal-warning';
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className={`modal-content ${getTypeClass()}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">{getTypeIcon()}</span>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-actions">
          <button 
            className="btn-modal-cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
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
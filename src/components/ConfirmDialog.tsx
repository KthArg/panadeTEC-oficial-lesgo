'use client';

import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-100',
      button: 'btn-danger'
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-100',
      button: 'bg-yellow-600 text-white hover:bg-yellow-700'
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-100',
      button: 'btn-primary'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${styles.bg}`}>
              <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className={`btn flex-1 ${styles.button}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
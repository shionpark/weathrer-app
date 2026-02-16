import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

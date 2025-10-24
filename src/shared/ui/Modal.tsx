import { ReactNode, useEffect } from 'react';
import { ModalPortal } from './ModalPortal';
type ModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  className?: string;
};

export const Modal = ({
  isModalOpen,
  closeModal,
  children,
  className = '',
}: ModalProps) => {
  useEffect(() => {
    const pressEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', pressEscape);
    return () => document.removeEventListener('keydown', pressEscape);
  }, [isModalOpen, closeModal]);
  if (!isModalOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-950/40"
          onClick={closeModal}
          role="presentation"
          aria-hidden="true"
        />
        <div
          className={`relative bg-white rounded-lg shadow-xl z-10 ${className}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

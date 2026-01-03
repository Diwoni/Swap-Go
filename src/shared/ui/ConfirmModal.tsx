import { Modal } from './Modal';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isPending?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '알림',
  message,
  cancelText = '취소',
  confirmText = '확인',
  isPending = false,
}: ConfirmModalProps) => {
  return (
    <Modal
      isModalOpen={isOpen}
      closeModal={onClose}
      className="w-[90%] max-w-[360px] p-6 overflow-hidden"
    >
      <div className="flex flex-col gap-4 text-center">
        <h3 className="text-lg font-bold text-gray-900 leading-none">{title}</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{message}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary-150 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50"
          >
            {isPending ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

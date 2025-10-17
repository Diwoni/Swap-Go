import { useModal } from '@/shared/hooks/useModal';
import { ModalPortal } from '@/shared/ui/ModalPortal';

type LoginModalProps = {
  modal: ReturnType<typeof useModal>;
};

export const LoginModal = ({ modal }: LoginModalProps) => {
  if (!modal.isModalOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-950/40"
          onClick={modal.closeModal}
        />
        <div
          className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold mb-4">로그인</h2>
          <div>로그인 폼</div>
        </div>
      </div>
    </ModalPortal>
  );
};

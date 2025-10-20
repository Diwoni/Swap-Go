import { useModals } from '@/shared/context/ModalContext';
import { ModalPortal } from '@/shared/ui/ModalPortal';

export const LoginModal = () => {
  const { loginModal } = useModals();
  if (!loginModal.isModalOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-950/40"
          onClick={loginModal.closeModal}
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

import { Modal } from '@/shared/ui';
import { LoginForm } from './LoginForm';
import { useModalContext } from '@/shared/hooks';

export const LoginModal = () => {
  const { loginModal } = useModalContext();

  return (
    <Modal
      isModalOpen={loginModal.isModalOpen}
      closeModal={loginModal.closeModal}
      className="flex flex-col items-center justify-center max-w-lg w-full h-[700px]"
    >
      <h2 className="text-lg font-semibold mb-10">로그인</h2>
      <LoginForm />
    </Modal>
  );
};

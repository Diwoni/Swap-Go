import { createContext, ReactNode, useContext } from 'react';
import { useModal } from '../hooks/useModal';

type ModalContextType = {
  loginModal: ReturnType<typeof useModal>;
  confirmModal: ReturnType<typeof useModal>;
  // 필요한 다른 모달 추가...
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const loginModal = useModal();
  const confirmModal = useModal();

  return (
    <ModalContext.Provider value={{ loginModal, confirmModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModals 는 ModalProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

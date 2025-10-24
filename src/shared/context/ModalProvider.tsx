import { ReactNode } from 'react';
import { useModal } from '../hooks/useModal';
import { ModalContext } from './modal.context';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const loginModal = useModal();
  const confirmModal = useModal();

  return (
    <ModalContext.Provider value={{ loginModal, confirmModal }}>
      {children}
    </ModalContext.Provider>
  );
};

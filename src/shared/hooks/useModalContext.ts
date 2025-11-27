import { useContext } from 'react';

import { ModalContext } from '../context/modal.context';

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModals 는 ModalProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

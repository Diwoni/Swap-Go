import { createContext } from 'react';

import { useModal } from '../hooks/useModal';

export type ModalContextType = {
  loginModal: ReturnType<typeof useModal>;
  confirmModal: ReturnType<typeof useModal>;
  // 필요한 다른 모달 추가...
};

export const ModalContext = createContext<ModalContextType | null>(null);

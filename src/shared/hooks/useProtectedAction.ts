import { useAuth } from '@/features/auth/hooks/useAuth';

import { useModalContext } from './useModalContext';

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const { loginModal } = useModalContext();

  const withAuth = (action: () => void | Promise<void>) => {
    if (isAuthenticated) {
      void action();
    } else {
      loginModal.openModal();
    }
  };

  return { withAuth, isAuthenticated };
};

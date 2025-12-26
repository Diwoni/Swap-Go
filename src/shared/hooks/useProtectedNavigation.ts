import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';

import { useModalContext } from './useModalContext';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loginModal } = useModalContext();

  const goTo = (path: string) => {
    if (isAuthenticated) navigate(path);
    else loginModal.openModal();
  };

  return { goTo };
};

import { useAuthContext } from '@/features/auth/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useModalContext } from './useModalContext';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { loginModal } = useModalContext();

  const goTo = (path: string) => {
    if (isAuthenticated) navigate(path);
    else loginModal.openModal();
  };

  return { goTo };
};

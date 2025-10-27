import { useNavigate } from 'react-router-dom';
import { useModalContext } from './useModalContext';
import { useAuth } from '@/features/auth/hooks/useAuth';

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

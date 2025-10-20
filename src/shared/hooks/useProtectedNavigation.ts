import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useModals } from '../context/ModalContext';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loginModal } = useModals();

  const goTo = (path: string) => {
    if (isAuthenticated) navigate(path);
    else loginModal.openModal();
  };

  return { goTo };
};

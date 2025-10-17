import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const openModal = () => {
    console.log('모달 열림');
  };

  const goTo = (path: string) => {
    if (isAuthenticated) navigate(path);
    else openModal();
  };

  return { goTo };
};

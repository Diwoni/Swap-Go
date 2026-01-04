import { useNavigate } from 'react-router-dom';

import { useProtectedAction } from './useProtectedAction';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { withAuth } = useProtectedAction();

  const goTo = (path: string) => {
    withAuth(() => navigate(path));
  };

  return { goTo };
};

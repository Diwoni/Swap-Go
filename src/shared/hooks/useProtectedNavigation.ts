import { useNavigate } from 'react-router-dom';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  // const {isLoggedIn} = useAuth();
  const isLoggedIn = true;
  // const {openModal} = useModal('login');
  const openModal = () => {
    console.log('모달 열림');
  };

  const goTo = (path: string) => {
    if (isLoggedIn) navigate(path);
    else openModal();
  };

  return { goTo };
};

import React from 'react';
import { CiChat2, CiUser } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { ProtectedNavButton } from './ProtectedNavButton';
import { useModal } from '@/shared/hooks/useModal';
import { LoginModal } from '@/features/login/ui/LoginModal';

const Header: React.FC = () => {
  const loginModal = useModal();

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="flex flex-row items-center justify-between max-w-[1400px] mx-auto h-[80px]">
          <span className="xl:pl-8 pl-4 text-2xl font-black text-primary-100">
            Swap & Go
          </span>
          <nav className="xl:w-[800px] xl:pl-[200px] w-[550px] pl-[50px]">
            <ul className="flex gap-20">
              <li>
                <Link to="/resale">중고거래</Link>
              </li>
              <li>
                <Link to="/rental">단기렌탈</Link>
              </li>
              <li>여행동반</li>
              <li>커뮤니티</li>
            </ul>
          </nav>
          <div className="flex items-center gap-4 xl:pr-8 pr-4">
            <button className="cursor-pointer" onClick={loginModal.openModal}>
              로그인
            </button>
            <button className="cursor-pointer">회원가입</button>
            <ProtectedNavButton path="/chat" className="flex gap-1">
              <CiChat2 className="w-6 h-6" />
              <span>채팅하기</span>
            </ProtectedNavButton>
            <ProtectedNavButton path="/mypage">
              <CiUser className="w-6 h-6 cursor-pointer" />
            </ProtectedNavButton>
          </div>
        </div>
      </header>
      {loginModal.isModalOpen && <LoginModal modal={loginModal} />}
    </>
  );
};

export default Header;

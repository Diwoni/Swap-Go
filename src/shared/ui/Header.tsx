import React from 'react';
import { CiChat2, CiUser } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { ProtectedNavButton } from './button/ProtectedNavButton';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="flex flex-row border items-center justify-between max-w-[1400px] mx-auto h-[80px]">
        <div className="xl:pl-8 pl-4 text-2xl font-black text-[#6B76FF]">
          Swap & Go
        </div>
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
          <button className="cursor-pointer">로그인</button>
          <button className="cursor-pointer">회원가입</button>
          <ProtectedNavButton path="/chat" className="flex gap-1">
            <CiChat2 className="w-6 h-6" />
            <p>채팅하기</p>
          </ProtectedNavButton>
          <ProtectedNavButton path="/mypage">
            <CiUser className="w-6 h-6 cursor-pointer" />
          </ProtectedNavButton>
        </div>
      </div>
    </header>
  );
};

export default Header;

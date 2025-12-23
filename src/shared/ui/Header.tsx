import React, { useState } from 'react';
import { CiMenuBurger, CiUser } from 'react-icons/ci'; // 햄버거 아이콘 추가
import { IoMdClose } from 'react-icons/io'; // 닫기 아이콘 (설치 필요, 없으면 X 텍스트로 대체 가능)
import { Link } from 'react-router-dom';

import { useAuth, useLogoutMutation } from '@/features/auth/hooks';

import { UnifiedSearchBar } from '../../widgets/SearchBar/ui/UnifiedSearchBar';
import { useModalContext } from '../hooks';
import { ProtectedNavButton } from './ProtectedNavButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 메뉴 상태
  const { loginModal } = useModalContext();
  const { isAuthenticated } = useAuth();
  const { mutate: logout } = useLogoutMutation();

  // 모바일 메뉴 토글 함수
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="relative flex flex-row items-center justify-between max-w-[1400px] mx-auto h-[80px] px-4 xl:px-8">
          {/* 1. 로고 */}
          <span className="font-maplestory text-2xl font-black text-primary-200 z-10">
            <Link to="/">Swap&Go</Link>
          </span>

          {/* 2. 데스크탑용 중앙 메뉴 (lg 이상에서만 보임, 절대위치 중앙정렬) */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ul className="flex gap-12 xl:gap-20 text-lg whitespace-nowrap font-medium text-gray-700">
              <li className="hover:text-black-200 hover:font-bold transition-colors">
                <Link to="/resale">중고거래</Link>
              </li>
              <li className="hover:text-black-200 hover:font-bold transition-colors">
                <Link to="/rental">단기렌탈</Link>
              </li>
              <li className="hover:text-black-200 hover:font-bold transition-colors">
                <Link to="/companion">여행동반</Link>
              </li>
            </ul>
          </nav>

          {/* 3. 데스크탑용 우측 버튼 (lg 이상에서만 보임) */}
          <div className="hidden lg:flex items-center gap-4 z-10">
            {isAuthenticated ? (
              <button
                className="cursor-pointer hover:text-black-200 hover:font-bold"
                onClick={() => logout()}
              >
                로그아웃
              </button>
            ) : (
              <button
                className="cursor-pointer hover:text-black-200 hover:font-bold"
                onClick={loginModal.openModal}
              >
                로그인
              </button>
            )}
            <button className="cursor-pointer hover:text-black-200 hover:font-bold">
              <Link to="/signup">회원가입</Link>
            </button>
            <ProtectedNavButton
              path="/chat"
              className="flex gap-1 hover:text-black-200 hover:font-bold"
            >
              <span>채팅하기</span>
            </ProtectedNavButton>
            <ProtectedNavButton path="/mypage">
              <CiUser className="w-6 h-6 cursor-pointer hover:text-black-200 hover:font-bold" />
            </ProtectedNavButton>
          </div>

          {/* 4. 모바일/태블릿용 햄버거 버튼 (lg 미만에서만 보임) */}
          <div className="lg:hidden z-10">
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? (
                // 닫기 아이콘이 없으면 <span>X</span> 로 대체 가능
                <IoMdClose className="w-7 h-7 text-gray-700" />
              ) : (
                <CiMenuBurger className="w-7 h-7 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* 5. 모바일 메뉴 드롭다운 (isMenuOpen일 때만 렌더링) */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b shadow-md absolute w-full left-0 top-[80px] flex flex-col p-4 gap-4 text-center animate-in slide-in-from-top-2">
            <ul className="flex flex-col gap-4 text-lg font-medium text-gray-700">
              <li>
                <Link to="/resale" onClick={toggleMenu}>
                  중고거래
                </Link>
              </li>
              <li>
                <Link to="/rental" onClick={toggleMenu}>
                  단기렌탈
                </Link>
              </li>
              <li>
                <Link to="/companion" onClick={toggleMenu}>
                  여행동반
                </Link>
              </li>
            </ul>
            <hr className="border-gray-200" />
            <div className="flex flex-col gap-3 text-gray-600">
              {/* 모바일에서도 로그인/채팅 접근 가능하도록 추가 */}
              <ProtectedNavButton path="/chat" onClick={toggleMenu}>
                채팅하기
              </ProtectedNavButton>
              <ProtectedNavButton path="/mypage" onClick={toggleMenu}>
                마이페이지
              </ProtectedNavButton>

              <div className="flex justify-center gap-4 mt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    로그아웃
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        loginModal.openModal();
                        toggleMenu();
                      }}
                    >
                      로그인
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={toggleMenu}>
                      <Link to="/signup">회원가입</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 검색바는 헤더 하단에 항상 유지 */}
        <UnifiedSearchBar />
      </header>

      {/* 헤더 높이만큼 여백 확보 (fixed 헤더 사용 시 필수) */}
      <div className="h-[140px]" />
    </>
  );
};

export default Header;

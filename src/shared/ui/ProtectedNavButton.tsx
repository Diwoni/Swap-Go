import { useProtectedNavigation } from '@/shared/hooks';

type ProtectedNavButtonProps = {
  path: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/* 로그인 여부에 따른 네비게이션 보호 버튼 (공통 로직 컴포넌트) */
export const ProtectedNavButton = ({
  path,
  children,
  className,
  onClick,
}: ProtectedNavButtonProps) => {
  const { goTo } = useProtectedNavigation();

  const handleClick = () => {
    goTo(path);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

import { useProtectedNavigation } from '@/shared/hooks';

type ProtectedNavButtonProps = {
  path: string;
  children: React.ReactNode;
  className?: string;
};

/* 로그인 여부에 따른 네비게이션 보호 버튼 (공통 로직 컴포넌트) */
export const ProtectedNavButton = ({
  path,
  children,
  className,
}: ProtectedNavButtonProps) => {
  const { goTo } = useProtectedNavigation();

  return (
    <button onClick={() => goTo(path)} className={className}>
      {children}
    </button>
  );
};

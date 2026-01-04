import { useProtectedNavigation } from '@/shared/hooks';

type ProtectedNavButtonProps = {
  path: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

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

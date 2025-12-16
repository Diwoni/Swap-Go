import { useCallback, useState } from 'react';

export function usePasswordMatch() {
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

  const validatePasswordMatch = useCallback((password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      setPasswordMatchError(null);
      return true;
    }
  }, []);

  return {
    passwordMatchError,
    validatePasswordMatch,
    setPasswordMatchError,
  };
}

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useSendEmailCodeMutation, useVerifyEmailCode } from './useEmailMutation';

type UseEmailVerificationReturn = {
  isCodeSent: boolean;
  isVerified: boolean;
  remainingTime: number;
  verificationCode: string;
  setVerificationCode: (v: string) => void;
  sendCode: () => void;
  verifyCode: () => void;
  resendCode: () => void;
  verificationToken: string | null;
};

export function useEmailVerification(email: string | null) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { mutate: sendVerificationCode } = useSendEmailCodeMutation();
  const { mutate: verifyEmailCode } = useVerifyEmailCode();
  const [verificationTokenState, setVerificationTokenState] = useState<string | null>(null);

  // 이메일 인증번호 발송 코드
  const sendCode = useCallback(() => {
    if (!email) {
      toast.error('이메일을 다시 확인해주세요.');
    } else {
      sendVerificationCode(
        { email },
        {
          onSuccess: (data) => {
            setIsCodeSent(true);
            setIsVerified(false);
            setVerificationCode('');
            setRemainingTime(data.expireIn);
          },
        }
      );
    }
  }, [email, sendVerificationCode]);

  // 인증번호 검증
  const verifyCode = useCallback(() => {
    if (!email) {
      return toast.error('이메일을 다시 확인해주세요.');
    }
    if (verificationCode.length !== 6) {
      return toast.error('인증번호 6자리를 입력해주세요.');
    }
    verifyEmailCode(
      { email, verificationCode: verificationCode },
      {
        onSuccess: (data) => {
          setIsVerified(true);
          setRemainingTime(0);
          if (data.verificationToken) {
            setVerificationTokenState(data.verificationToken);
          }
        },
      }
    );
  }, [email, verificationCode, verifyEmailCode]);

  // 인증번호 재발송
  const resendCode = useCallback(() => {
    sendCode();
  }, [sendCode]);

  // 타이머
  useEffect(() => {
    if (remainingTime <= 0) {
      setIsCodeSent(false);
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);

  return {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isVerified,
    verifyCode,
    remainingTime,
    sendCode,
    resendCode,
    verificationToken: verificationTokenState,
  } as UseEmailVerificationReturn;
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { formatTime } from '@/shared/utils/formatTime';
import {
  useSignupMutation,
  useSendEmailCodeMutation,
  useVerifyEmailCode,
} from '../../hooks';
import { SignupFormData, signupSchema } from '../../types';

export const SignupForm = () => {
  const { mutate: signup } = useSignupMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });
  // ===== 이메일 인증 관련 상태 =====
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [verificationToken, setVerificationToken] = useState<string | null>('');
  const { mutate: sendVerificationCode } = useSendEmailCodeMutation();
  const { mutate: verifyEmailCode } = useVerifyEmailCode();

  // 이메일 필드 값 구독
  const email = watch('email');

  /** 이메일 인증번호 발송 코드 */
  const sendEmailCode = () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 이메일 유효성 검사
    sendVerificationCode(
      { email },
      {
        onSuccess: () => {
          setIsCodeSent(true);
          setIsVerified(false);
          setVerificationCode('');
          setRemainingTime(300);
          alert('인증번호가 발송되었습니다.');
        },
      }
    );
  };

  /** 타이머 */
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

  /** 인증번호 재발송 함수 */
  const resendEmailCode = () => {
    if (remainingTime > 0) {
      alert(`${formatTime(remainingTime)} 후에 재발송할 수 있습니다.`);
      return;
      sendEmailCode();
    }
  };

  /** 인증번호 확인 함수 */
  const verifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('6자리 인증번호를 입력해주세요.');
      return;
    }
    verifyEmailCode(
      { email, code: verificationCode },
      {
        onSuccess: (data) => {
          const token = data.verificationToken;
          setIsVerified(true);
          setVerificationToken(token);
          setRemainingTime(0);
          alert('이메일 인증이 완료되었습니다.');
        },
      }
    );
  };

  /** 회원가입 제출 함수 */
  const submitSignup = (data: SignupFormData) => {
    const signupRequest = {
      username: data.username,
      password: data.password,
      email: data.email,
      verificationToken: verificationToken || 'verified',
    };
    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    signup(signupRequest, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  // 비밀번호 확인용 상태
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null
  );

  const password = watch('password'); // 비밀번호 필드의 값 구독

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    if (password !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordMatchError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitSignup)}>
      {/* 이메일 입력 */}
      <div className="mt-8 flex flex-col">
        <label
          htmlFor="email"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          이메일
        </label>
        <div className="flex w-[430px] justify-between">
          <input
            {...register('email')}
            id="email"
            type="text"
            placeholder="jgw117@naver.com"
            className={`input w-[280px] ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-black-100 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={sendEmailCode}
            className="btn btn-primary btn-sm w-[140px] rounded-[10px]"
          >
            인증번호 발송
          </button>
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* 인증번호 */}
      {isCodeSent && !isVerified && (
        <div className="flex justify-between mt-3">
          <input
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
            }}
            placeholder="인증번호를 입력하세요"
            className="input w-[210px]"
          />
          {remainingTime > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              남은 시간: {formatTime(remainingTime)}
            </p>
          )}
          <button
            onClick={verifyCode}
            className="btn btn-primary w-[100px] rounded-[10px]"
          >
            인증확인
          </button>
          <button
            onClick={resendEmailCode}
            className="btn btn-primary w-[100px] rounded-[10px]"
          >
            재발송
          </button>
        </div>
      )}
      {/* 비밀번호 */}
      <div className="flex flex-col mt-3">
        <label
          htmlFor="password"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          비밀번호
        </label>
        <input
          className="input"
          {...register('password')}
          type="password"
          id="password"
          placeholder="비밀번호를 입력해주세요"
        />
        <div className="flex mt-3">
          <input
            className="input"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            onBlur={handleConfirmPasswordBlur}
          />
        </div>
        {passwordMatchError && (
          <p className="mt-1 text-sm text-red-600">{passwordMatchError}</p>
        )}
      </div>
      {/* 이름 */}
      <div className="flex flex-col mt-3">
        <label
          htmlFor="username"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          이름
        </label>
        <input
          className="input"
          {...register('username')}
          type="text"
          id="username"
          placeholder="이름을 입력해주세요"
        />
      </div>

      {/* 주소 Todo : 구글맵 api 연동 */}
      <div className="flex flex-col mt-3">
        <label
          htmlFor="address"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          주소
        </label>
        <input className="input" />
      </div>

      {/* 회원가입 버튼 */}
      <div className="mt-4 flex flex-col gap-2">
        <button type="submit" className="btn btn-primary btn-lg">
          회원가입
        </button>
        <button
          type="button"
          className="btn btn-lg btn-primary text-black-200 bg-kakao hover:bg-[#FDD835]"
        >
          <span>💬 카카오톡으로 로그인</span>
        </button>
      </div>
    </form>
  );
};

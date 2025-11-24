import { useForm } from 'react-hook-form';
import { SignupFormData, signupSchema } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignupMutation } from '../hooks/useSignupMutation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

  const submitSignup = (data: SignupFormData) => {
    console.log(data);
    signup(data, {
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
          <button className="btn btn-primary btn-sm w-[140px] rounded-[10px]">
            인증번호 발송
          </button>
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* 인증번호 */}
      <div className="flex justify-between mt-3">
        <input
          placeholder="인증번호를 입력하세요"
          className="input w-[210px]"
        />
        <button className="btn btn-primary w-[100px] rounded-[10px]">
          인증확인
        </button>
        <button className="btn btn-primary w-[100px] rounded-[10px]">
          재발송
        </button>
      </div>

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

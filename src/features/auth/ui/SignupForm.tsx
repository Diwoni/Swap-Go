import { useForm } from 'react-hook-form';
import { SignupFormData, signupSchema } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignupMutation } from '../hooks/useSignupMutation';
import { useNavigate } from 'react-router-dom';

export const SignupForm = () => {
  const { mutate: signup } = useSignupMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
            인증번호 보내기
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
      </div>

      {/* 이름 */}
      <div className="flex flex-col mt-3">
        <label
          htmlFor="name"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          이름
        </label>
        <input
          className="input"
          {...register('name')}
          type="text"
          id="name"
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
          <span className="text-base font-semibold">
            💬 카카오톡으로 로그인
          </span>
        </button>
      </div>
    </form>
  );
};

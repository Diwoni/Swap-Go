import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { formatTime } from '@/shared/utils/formatTime';

import { useModal } from '../../../../shared/hooks';
import { LocationPickerModal } from '../../../map/ui/LocationPickerModal';
import { useEmailVerification, usePasswordMatch, useSignupSubmit } from '../../hooks';
import { SignupFormData, signupSchema } from '../../types';

export const SignupForm = () => {
  const form = useForm<SignupFormData>({ resolver: zodResolver(signupSchema), mode: 'onBlur' });
  const mapModal = useModal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const email = watch('email');
  const password = watch('password');

  const {
    isCodeSent,
    isVerified,
    remainingTime,
    verificationCode,
    setVerificationCode,
    verificationToken,
    sendCode,
    verifyCode,
    resendCode,
  } = useEmailVerification(email);

  const { passwordMatchError, validatePasswordMatch } = usePasswordMatch();
  const { submit } = useSignupSubmit();

  // 회원가입 폼 제출
  const onSubmit = (data: SignupFormData) => {
    if (!isVerified) {
      return toast.error('이메일 인증을 완료해주세요.');
    }
    submit({ ...data, verificationToken: verificationToken });
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      {/* 이메일 입력 */}
      <div className="mt-8 flex flex-col">
        <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
          이메일
        </label>
        <div className="flex w-[430px] justify-between">
          <input
            {...register('email')}
            id="email"
            type="text"
            placeholder="jgw117@naver.com"
            className={`input w-[300px] ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-black-100 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {isCodeSent ? (
            <button onClick={resendCode} className="btn btn-primary btn-sm rounded-[10px]">
              재발송
            </button>
          ) : (
            <button
              onClick={sendCode}
              className="btn btn-primary btn-sm rounded-[10px] disabled:bg-gray-300"
            >
              인증하기
            </button>
          )}
        </div>
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* 인증번호 */}
      {isCodeSent && !isVerified && (
        <div className="flex justify-between mt-3">
          <div className="relative w-[300px]">
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호를 입력하세요"
              className="input w-full pr-14"
            />

            {remainingTime > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">
                {formatTime(remainingTime)}
              </span>
            )}
          </div>
          <button onClick={verifyCode} className="btn btn-primary btn-sm rounded-[10px]">
            인증확인
          </button>
        </div>
      )}
      {/* 비밀번호 */}
      <div className="flex flex-col mt-3">
        <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
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
            onBlur={(e) => validatePasswordMatch(password, e.target.value)}
          />
        </div>
        {passwordMatchError && <p className="mt-1 text-sm text-red-600">{passwordMatchError}</p>}
      </div>
      {/* 이름 */}
      <div className="flex flex-col mt-3">
        <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
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

      {/* 위치 선택 모달 트리거 */}
      <div className="flex flex-col mt-3">
        <label htmlFor="location" className="block text-lg font-semibold text-gray-700 mb-2">
          위치 선택
        </label>
        <button
          type="button"
          onClick={mapModal.openModal}
          className="btn btn-secondary btn-sm w-[150px]"
        >
          위치 설정하기
        </button>
      </div>
      <LocationPickerModal isOpen={mapModal.isModalOpen} onClose={mapModal.closeModal} />

      {/* 주소: country / region / street (street 선택사항) */}
      <div className="flex flex-col mt-3">
        <label htmlFor="address" className="block text-lg font-semibold text-gray-700 mb-2">
          주소
        </label>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
              국가
            </label>
            <input
              id="address.country"
              className="input"
              {...register('address.country')}
              placeholder="국가 (예: South Korea)"
            />
            {errors.address?.country?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.address.country?.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address.region" className="block text-sm font-medium text-gray-700">
              지역(시/도)
            </label>
            <input
              id="address.region"
              className="input"
              {...register('address.region')}
              placeholder="지역 (예: Seoul)"
            />
            {errors.address?.region?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.address.region?.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              상세주소 (선택)
            </label>
            <input
              id="address.street"
              className="input"
              {...register('address.street')}
              placeholder="도로명/건물명 등 (선택)"
            />
            {errors.address?.street?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.address.street?.message}</p>
            )}
          </div>
        </div>
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

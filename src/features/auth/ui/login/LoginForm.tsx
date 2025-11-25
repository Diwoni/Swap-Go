import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useLoginForm } from '../../hooks';

export const LoginForm = () => {
  const {
    register,
    errors: formErrors,
    showPassword,
    toggleShowPassword,
    isPending,
    onSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* 아이디 입력 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          아이디
        </label>
        <input
          {...register('email')}
          id="email"
          type="text"
          placeholder="l50227697@gmail.com"
          autoComplete="username"
          className={`
            w-[430px] h-[60px] px-4 rounded-lg border bg-white
            text-base text-gray-900 placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              formErrors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {formErrors.email && (
          <p className="mt-2 text-sm text-red-600">
            {formErrors.email.message}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          비밀번호
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="current-password"
            className={`
              w-[430px] h-[60px] px-4 pr-12 rounded-lg border bg-white
              text-base text-gray-900 placeholder-gray-430
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${
                formErrors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-430 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="w-5 h-5" />
            ) : (
              <AiOutlineEye className="w-5 h-5" />
            )}
          </button>
        </div>
        {formErrors.password && (
          <p className="mt-2 text-sm text-red-600">
            {formErrors.password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className={`
          btn btn-primary btn-lg
          ${
            isPending
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-100 hover:bg-primary-200 text-white'
          }
        `}
        >
          {isPending ? '로그인 중...' : '로그인'}
        </button>

        {/* 카카오톡으로 로그인 */}
        <button
          type="button"
          className="btn btn-lg btn-primary text-black-200 bg-kakao hover:bg-[#FDD835]"
        >
          <span className="text-lg">💬</span>
          카카오톡으로 로그인
        </button>

        {/* 회원가입 */}
        <button
          type="button"
          className="btn btn-primary btn-lg bg-black-150 hover:bg-black-200"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

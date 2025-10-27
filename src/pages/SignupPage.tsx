import { SignupForm } from '@/features/auth/ui';

const SignupPage = () => {
  return (
    <div className="w-[1400px] max-h-screen py-[120px] flex flex-col items-center">
      <span className="text-2xl font-semibold">회원가입</span>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

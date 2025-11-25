import { useModalContext } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../../types';
import { useLoginMutation } from './useLoginMutation';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginModal } = useModalContext();
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitLogin = (data: LoginFormData) => {
    console.log(data);
    login(data, {
      onSuccess: () => {
        loginModal.closeModal();
      },
    });
  };

  // ✅ handleSubmit을 직접 반환
  const onSubmit = handleSubmit(submitLogin);

  return {
    register,
    errors,
    showPassword,
    toggleShowPassword,
    isPending,
    onSubmit, // 이미 이벤트 핸들러 함수
  };
};

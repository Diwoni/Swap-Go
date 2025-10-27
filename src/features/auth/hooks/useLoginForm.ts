import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { LoginFormData, loginSchema } from '../types/auth.schema';
import { useModalContext } from '@/shared/hooks';

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
  // void 로 명시적 처리 (lint)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(submitLogin);
  };

  return {
    // Form state
    register,
    errors,

    // Password visibility
    showPassword,
    toggleShowPassword,

    // Loading state
    isPending,

    // Submit handler
    onSubmit,
  };
};

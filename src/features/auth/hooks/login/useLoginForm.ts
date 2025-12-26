import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useModalContext } from '@/shared/hooks';

import { LoginFormData, loginSchema } from '../../types';
import { useLoginMutation } from './useLoginMutation';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginModal } = useModalContext();
  const { mutate: login, isPending } = useLoginMutation();
  const navigate = useNavigate();

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
    // console.log(data);
    login(data, {
      onSuccess: () => {
        loginModal.closeModal();
      },
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(submitLogin)(e);
  };

  const clickSignupButton = () => {
    navigate('/signup');
    loginModal.closeModal();
  };

  return {
    register,
    errors,
    showPassword,
    toggleShowPassword,
    isPending,
    onSubmit,
    clickSignupButton,
  };
};

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { useModals } from '@/shared/context/ModalContext';
import { LoginFormData, loginSchema } from '../types/login.schema';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginModal } = useModals();
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

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
    login(data, {
      onSuccess: () => {
        loginModal.closeModal();
      },
    });
  };

  return {
    // Form state
    register,
    handleSubmit,
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

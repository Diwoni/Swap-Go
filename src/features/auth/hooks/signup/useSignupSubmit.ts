// src/hooks/useSignupSubmit.ts
import { useCallback } from 'react';

import { SignupFormData } from '../../types';
import { useSignupMutation } from './useSignupMutation';

export function useSignupSubmit() {
  const { mutate: signupMutate } = useSignupMutation();

  const submit = useCallback(
    (data: SignupFormData & { verificationToken: string | null }) => {
      signupMutate({
        username: data.username,
        password: data.password,
        email: data.email,
        address: data.address,
        verificationToken: data.verificationToken ?? '',
      });
    },
    [signupMutate]
  );

  return { submit };
}

import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useErrorStore } from '../store/errorStore';

export const ToastSubscriber = () => {
  const errorMessage = useErrorStore((s) => s.errorMessage);
  const clearError = useErrorStore((s) => s.clearError);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      clearError();
    }
  }, [errorMessage, clearError]);

  return null;
};

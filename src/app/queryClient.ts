import { MutationCache, QueryClient } from '@tanstack/react-query';

import { useErrorStore } from '@/shared/store/errorStore';
import { handleAPIError } from '@/shared/utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      const message = handleAPIError(error);
      useErrorStore.getState().setError(message);
    },
  }),
});

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { ErrorBoundary } from './ErrorBoundary';

export const QueryErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { reset } = useQueryErrorResetBoundary();
  return <ErrorBoundary onReset={reset}>{children}</ErrorBoundary>;
};

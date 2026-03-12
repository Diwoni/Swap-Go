import * as Sentry from '@sentry/react';

export const captureException = (error: unknown, context?: Record<string, unknown>): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('[Sentry]', error, context ?? '');
  }
};

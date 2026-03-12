import { Component, ErrorInfo, ReactNode } from 'react';

import { captureException } from '@/shared/utils/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureException(error, { componentStack: info.componentStack ?? '' });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-20">
          <div className="text-5xl mb-4 text-red-400">!</div>
          <p className="text-lg font-medium text-gray-700">
            페이지를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-sm text-gray-400 mt-2">잠시 후 다시 시도해주세요.</p>
          <button
            onClick={this.handleReset}
            className="mt-6 px-6 py-2 bg-primary-200 text-white text-sm font-semibold rounded-lg hover:bg-primary-300 transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

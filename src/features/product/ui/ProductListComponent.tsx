import { ReactNode } from 'react';

type ResultHeaderProps = {
  region?: string;
  action?: ReactNode;
};

export const ResultHeader = ({ region, action }: ResultHeaderProps) => (
  <div className="flex items-center justify-between gap-4 pb-3">
    <div className="flex text-lg font-medium">
      <span className="text-primary-200 ml-2">{region ?? '전체'}</span>
      <span>에서의 검색결과</span>
    </div>
    {action}
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center py-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 m-4">
    <div className="text-6xl mb-4">🔍</div>
    <p className="text-lg font-medium text-gray-600">검색 결과가 없습니다.</p>
    <p className="text-sm text-gray-400 mt-2">다른 키워드나 카테고리로 다시 시도해보세요.</p>
  </div>
);

interface ErrorStateProps {
  onRetry?: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center py-32 bg-red-50 rounded-xl border border-dashed border-red-200 m-4">
    <div className="text-5xl mb-4 text-red-400">!</div>
    <p className="text-lg font-medium text-gray-700">상품을 불러오지 못했습니다.</p>
    <p className="text-sm text-gray-400 mt-2">
      서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2 bg-primary-200 text-white text-sm font-semibold rounded-lg hover:bg-primary-300 transition-colors"
      >
        다시 시도
      </button>
    )}
  </div>
);

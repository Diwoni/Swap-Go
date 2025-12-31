export const ResultHeader = ({ region }: { region?: string }) => (
  <div className="flex pb-3 text-lg font-medium">
    <span className="text-primary-200 ml-2">{region ?? '전체'}</span>
    <span>에서의 검색결과</span>
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center py-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 m-4">
    <div className="text-6xl mb-4">🔍</div>
    <p className="text-lg font-medium text-gray-600">검색 결과가 없습니다.</p>
    <p className="text-sm text-gray-400 mt-2">다른 키워드나 카테고리로 다시 시도해보세요.</p>
  </div>
);

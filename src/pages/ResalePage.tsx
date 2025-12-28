import { useResalePage } from '../features/product/hooks/useResalePage';
import { ProductCard } from '../features/product/ui/ProductCard';

const ResalePage = () => {
  const { products, region, isLoading, isFetchingNextPage, isEmpty, loadMoreRef } = useResalePage();

  if (isLoading) {
    return <div className="p-10 text-center">상품 불러오는 중...</div>;
  }

  return (
    <div className="flex mt-[60px]">
      <Sidebar />

      {/* 3. 데이터 유무에 따른 분기 처리 */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <section className="flex flex-col p-2 w-full">
          <ResultHeader region={region} />

          {/* 4. 상품 리스트 */}
          <div className="max-w-[1120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                region={item.region}
                createdAt={item.createdAt}
                imageUrl={item.thumbnailUrl}
                liked={item.isLiked}
              />
            ))}
          </div>

          {/* 5. 무한 스크롤 트리거 */}
          <div ref={loadMoreRef} className="h-20 flex justify-center items-center mt-8">
            {isFetchingNextPage && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
                <span className="text-sm text-gray-500">더 불러오는 중...</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const Sidebar = () => (
  <section className="w-[280px] border shrink-0 hidden md:block">사이드 바</section>
);

const ResultHeader = ({ region }: { region?: string }) => (
  <div className="flex pb-4 text-lg font-medium">
    <span className="text-blue-600 mr-1">{region ?? '전체'}</span>
    <span>에서의 검색결과</span>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center py-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 m-4">
    <div className="text-6xl mb-4">🔍</div>
    <p className="text-lg font-medium text-gray-600">검색 결과가 없습니다.</p>
    <p className="text-sm text-gray-400 mt-2">다른 키워드나 카테고리로 다시 시도해보세요.</p>
  </div>
);

export default ResalePage;

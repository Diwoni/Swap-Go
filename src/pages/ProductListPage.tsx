import { ROUTE_PATH } from '@/app/router/path';

import { useProductListPage } from '../features/product/hooks/useProductListPage';
import { ProductType } from '../features/product/types/productList';
import { EmptyState, ErrorState, ResultHeader } from '../features/product/ui';
import { ProductCard } from '../features/product/ui/ProductCard';
import { ProtectedNavButton } from '../shared/ui';
import { ScrollToTopButton } from '../widgets/ui/ScrollToTopButton/ScrollToTopButton';
import { FilterSidebar } from '../widgets/ui/Sidebar';

interface Props {
  type: ProductType; // 'resale' | 'rental'
}

export const ProductListPage = ({ type }: Props) => {
  const {
    products,
    region,
    isLoading,
    isError,
    isFetchingNextPage,
    isEmpty,
    loadMoreRef,
    refetch,
  } = useProductListPage(type);

  return (
    <div className="flex mt-[60px]">
      <FilterSidebar />

      <section className="flex-1 flex flex-col p-2 min-w-0">
        <ResultHeader
          region={region}
          action={
            <ProtectedNavButton
              path={ROUTE_PATH.LISTING_NEW}
              className="inline-flex h-11 items-center rounded-lg bg-primary-200 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-300"
            >
              게시글 작성
            </ProtectedNavButton>
          }
        />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-500 mb-4" />
            <p className="text-gray-500 font-medium">상품을 불러오는 중입니다...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col w-full">
            <ErrorState
              onRetry={() => {
                void refetch();
              }}
            />
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col w-full">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="max-w-[1120px] mx-auto w-full justify-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 gap-y-4">
              {products.map((item) => (
                <ProductCard
                  itemType={type}
                  key={item.itemId}
                  itemId={item.itemId}
                  title={item.title}
                  price={item.price}
                  deposit={item.deposit}
                  region={item.region}
                  createdAt={item.createdAt}
                  thumbnailUrl={item.thumbnailUrl}
                  isliked={item.isLiked}
                />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="h-20 flex justify-center items-center mt-8 w-full">
              {isFetchingNextPage && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
                  <span className="text-sm text-gray-500">더 불러오는 중...</span>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <ScrollToTopButton />
    </div>
  );
};

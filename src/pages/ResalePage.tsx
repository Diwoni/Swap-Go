import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import { useGetResaleList } from '../features/product/hooks/useGetResaleList';
import { ProductCard } from '../features/product/ui/ProductCard';

const ResalePage = () => {
  const [searchParams] = useSearchParams();

  const region = searchParams.get('region') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const keyword = searchParams.get('keyword') ?? undefined;

  // 2. 훅 실행 (params가 바뀌면 자동으로 API 재호출됨 ✨)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetResaleList({
    region,
    category, // API 함수에서 내부적으로 배열처리/변환됨
    keyword,
    // 필요하다면 기본 정렬이나 dealType 추가 가능
    // dealType: 'SELL'
  });

  // 3. 무한 스크롤 트리거
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 4. 로딩 및 에러 처리 (스켈레톤 UI를 넣으면 더 좋음)
  if (isLoading) return <div className="p-10 text-center">상품 불러오는 중...</div>;

  // 5. 결과 렌더링
  // useInfiniteQuery는 데이터가 data.pages 배열 안에 담겨 있음
  const firstPageItems = data?.pages?.[0]?.items;
  // 2. items가 없거나(undefined), 길이가 0이면 '비어있음'
  const isEmpty = !firstPageItems || firstPageItems.length === 0;

  return (
    <div>
      {isEmpty ? (
        // 1. 검색 결과 없음 UI
        <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-medium text-gray-600">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">다른 키워드나 카테고리로 다시 시도해보세요.</p>
        </div>
      ) : (
        // 2. 상품 그리드 리스트
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.pages.map((page, pageIndex) => (
            // Fragment 사용: Grid 레이아웃이 깨지지 않게 감싸줌
            <Fragment key={pageIndex}>
              {page.items.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  region={item.region}
                  createdAt={item.createdAt}
                  // 👇 API 필드명과 컴포넌트 Props 매핑
                  imageUrl={item.thumbnailUrl}
                  liked={item.isLiked}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {/* 3. 무한 스크롤 하단 로딩바 (센서) */}
      <div ref={ref} className="h-20 flex justify-center items-center mt-8">
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
            <span className="text-sm text-gray-500">더 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResalePage;

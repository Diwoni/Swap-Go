import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import { useGetResaleList } from './useGetResaleList';

export const useResalePage = () => {
  // 관심사 통합 (URL 파라미터 읽기)
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const keyword = searchParams.get('keyword') ?? undefined;
  const priceRange = searchParams.get('priceRange') ?? undefined;
  const isAvailable = searchParams.get('isAvailable') === 'true';
  const dealType = searchParams.get('dealType') ?? undefined;

  // 데이터 패칭
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetResaleList({
    region,
    category,
    keyword,
    priceRange,
    isAvailable,
    dealType,
  });

  // 무한 스크롤
  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 데이터 가공
  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && products.length === 0;

  return {
    products,
    region,

    isLoading,
    isFetchingNextPage,
    isEmpty,

    loadMoreRef,
  };
};

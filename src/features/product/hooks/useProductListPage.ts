import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import { GetProductListParams, ProductType } from '../types/productList';
import { useGetProductList } from './useGetProductList';

export const useProductListPage = (type: ProductType) => {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') ?? undefined;

  const params: GetProductListParams = useMemo(
    () => ({
      region,
      category: searchParams.get('category') ?? undefined,
      keyword: searchParams.get('keyword') ?? undefined,
      priceRange: searchParams.get('priceRange') ?? undefined,
      isAvailable: searchParams.get('isAvailable') === 'true',
      dealType: searchParams.get('dealType') ?? undefined,
    }),
    [searchParams, region]
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetProductList(
    type,
    params
  );

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { getProductList } from '../api/product.api';
import { productKeys } from '../queryKeys';
import { GetProductListParams, ProductListResponse, ProductType } from '../types';

export const useGetProductList = (type: ProductType, params: GetProductListParams) => {
  return useInfiniteQuery<
    ProductListResponse,
    Error,
    InfiniteData<ProductListResponse>,
    ReturnType<typeof productKeys.list>,
    number | undefined
  >({
    queryKey: productKeys.list(type, params),

    queryFn: ({ pageParam }) =>
      getProductList(type, {
        ...params,
        cursor: pageParam,
      }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;
      return lastPage.nextCursor;
    },
  });
};

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { getResaleProductList } from '../api/resale.api';
import { GetResaleListParams, ResaleListResponse } from '../types/resale';

// 쿼리 키 관리 -> invalidation 할 때의 편의성
export const resaleKeys = {
  all: ['resale'] as const,
  lists: () => [...resaleKeys.all, 'list'] as const,
  list: (params: GetResaleListParams) => [...resaleKeys.lists(), params] as const,
};

// 2. Custom Hook
export const useGetResaleList = (params: GetResaleListParams) => {
  return useInfiniteQuery<
    ResaleListResponse,
    Error,
    InfiniteData<ResaleListResponse>,
    ReturnType<typeof resaleKeys.list>,
    number | undefined
  >({
    queryKey: resaleKeys.list(params),

    // pageParam은 useInfiniteQuery가 관리하는 현재 커서 위치입니다.
    queryFn: ({ pageParam }) =>
      getResaleProductList({
        ...params,
        cursor: pageParam,
      }),
    initialPageParam: undefined,

    // lastPage => 방금 받아온 응답 데이터
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;
      return lastPage.nextCursor;
    },
  });
};

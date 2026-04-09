import { useQuery } from '@tanstack/react-query';

import { mypageApi } from '../api/mypage.api';
import { mypageKeys } from '../queryKeys';
import { MyItem } from '../types/mypage.types';

const DEAL_TYPE_LABEL: Record<string, string> = {
  SELL: '판매중',
  RENT: '대여중',
};

export const useMyItems = () => {
  const { data, isLoading } = useQuery({
    queryKey: mypageKeys.myItems(),
    queryFn: mypageApi.getMyItems,
    throwOnError: true,
  });

  const items: MyItem[] = data?.items ?? [];
  const isEmpty = !isLoading && items.length === 0;

  const getDealTypeLabel = (dealType: string) => DEAL_TYPE_LABEL[dealType] ?? dealType;

  return { items, isLoading, isEmpty, getDealTypeLabel };
};

import { useQuery } from '@tanstack/react-query';

import { getRentalProductDetail, getResaleProductDetail } from '../api/product.api';
import { productKeys } from '../queryKeys';

export const useGetResaleProductDetail = (itemId: number) => {
  return useQuery({
    queryKey: productKeys.detail('resale', itemId),
    queryFn: () => getResaleProductDetail(itemId),
    enabled: !!itemId,
  });
};

export const useGetRentalProductDetail = (itemId: number) => {
  return useQuery({
    queryKey: productKeys.detail('rental', itemId),
    queryFn: () => getRentalProductDetail(itemId),
    enabled: !!itemId,
  });
};

import { useQuery } from '@tanstack/react-query';

import { getRentalProductDetail, getResaleProductDetail } from '../api/product.api';

export const useGetResaleProductDetail = (itemId: number) => {
  return useQuery({
    queryKey: ['product', 'resale', itemId],
    queryFn: () => getResaleProductDetail(itemId),
    enabled: !!itemId,
  });
};

export const useGetRentalProductDetail = (itemId: number) => {
  return useQuery({
    queryKey: ['product', 'rental', itemId],
    queryFn: () => getRentalProductDetail(itemId),
    enabled: !!itemId,
  });
};

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getRentalProductDetail, getResaleProductDetail } from '../api/product.api';
import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';

export const useProductDetailPage = () => {
  const { type, itemId } = useParams<{ type: 'rental' | 'resale'; itemId: string }>();

  const id = Number(itemId);
  const isResale = type === 'resale';
  const isRental = type === 'rental';

  const isValid = !!itemId && (isResale || isRental);

  const { data, isLoading, isError, error } = useQuery<ResaleProductDetail | RentalProductDetail>({
    queryKey: ['product', type, id],
    queryFn: () => {
      if (isResale) return getResaleProductDetail(id);
      if (isRental) return getRentalProductDetail(id);
      return Promise.reject(new Error('잘못된 접근입니다.'));
    },
    enabled: isValid,
  });

  return {
    type,
    itemId,
    data, // ResaleProductDetail | RentalProductDetail | undefined
    isLoading,
    isError,
    error,
  };
};

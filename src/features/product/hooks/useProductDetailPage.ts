import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getRentalProductDetail, getResaleProductDetail } from '../api/product.api';
import { productKeys } from '../queryKeys';
import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';

export const useProductDetailPage = () => {
  const { type, itemId } = useParams<{ type: 'rental' | 'resale'; itemId: string }>();

  const id = Number(itemId);
  const isResale = type === 'resale';
  const isRental = type === 'rental';

  const isValid = !!itemId && (isResale || isRental);

  const { data, isLoading, isError, error } = useQuery<ResaleProductDetail | RentalProductDetail>({
    queryKey: productKeys.detail(type!, id),
    queryFn: () => {
      if (isResale) return getResaleProductDetail(id);
      if (isRental) return getRentalProductDetail(id);
      return Promise.reject(new Error('잘못된 접근입니다.'));
    },
    enabled: isValid,
  });

  const { resaleItems, rentalItems } = useMemo(() => {
    if (!data || !data.recentPostsBySeller) {
      return { resaleItems: [], rentalItems: [] };
    }

    const posts = data.recentPostsBySeller;

    return {
      resaleItems: posts.filter((item) => item.itemType === 'resale'),
      rentalItems: posts.filter((item) => item.itemType === 'rental'),
    };
  }, [data]);

  return {
    type,
    itemId,
    data,
    resaleItems,
    rentalItems,
    isLoading,
    isError,
    error,
  };
};

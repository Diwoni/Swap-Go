import { api, formatCategory } from '@/shared/utils';

import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';
import {
  GetProductListParams,
  ProductItem,
  ProductListResponse,
  ProductType,
} from '../types/productList';

const isValidProductItem = (item: unknown): item is ProductItem => {
  return item != null && typeof (item as ProductItem).itemId === 'number';
};

const normalizeProductListResponse = (raw: unknown): ProductListResponse => {
  const data = raw as Partial<ProductListResponse>;
  const items = Array.isArray(data?.items) ? data.items.filter(isValidProductItem) : [];

  return {
    count: data?.count ?? 0,
    nextCursor: data?.nextCursor ?? null,
    hasNext: data?.hasNext ?? false,
    items,
  };
};

export const getProductList = async (
  type: ProductType,
  params: GetProductListParams = {}
): Promise<ProductListResponse> => {
  const { category, ...rest } = params;
  const endpoint = `/${type}/items/search`;

  const response = await api.get<unknown>(endpoint, {
    params: {
      ...rest,
      category: formatCategory(category),
    },
  });

  return normalizeProductListResponse(response.data);
};

export const getResaleProductDetail = async (itemId: number): Promise<ResaleProductDetail> => {
  const response = await api.get<ResaleProductDetail>(`/resale/items/${itemId}`);
  return response.data;
};

export const getRentalProductDetail = async (itemId: number): Promise<RentalProductDetail> => {
  const response = await api.get<RentalProductDetail>(`/rental/items/${itemId}`);
  return response.data;
};

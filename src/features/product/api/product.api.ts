import { api, formatCategory } from '@/shared/utils';

import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';
import { GetProductListParams, ProductListResponse, ProductType } from '../types/productList';
import {
  parseProductListResponse,
  parseRentalProductDetail,
  parseResaleProductDetail,
} from './product.schema';

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

  return parseProductListResponse(response.data);
};

export const getResaleProductDetail = async (itemId: number): Promise<ResaleProductDetail> => {
  const response = await api.get<unknown>(`/resale/items/${itemId}`);
  return parseResaleProductDetail(response.data);
};

export const getRentalProductDetail = async (itemId: number): Promise<RentalProductDetail> => {
  const response = await api.get<unknown>(`/rental/items/${itemId}`);
  return parseRentalProductDetail(response.data);
};

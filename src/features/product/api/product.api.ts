import { api, formatCategory } from '@/shared/utils';

import { GetProductListParams, ProductListResponse, ProductType } from '../types/productList';

export const getProductList = async (
  type: ProductType,
  params: GetProductListParams = {}
): Promise<ProductListResponse> => {
  const { category, ...rest } = params;
  const endpoint = `/${type}/items/search`;

  const response = await api.get<ProductListResponse>(endpoint, {
    params: {
      ...rest,
      category: formatCategory(category),
    },
  });

  return response.data;
};

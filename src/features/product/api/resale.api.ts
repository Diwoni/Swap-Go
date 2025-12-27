import { api } from '../../../shared/utils/axios';
import { GetResaleListParams, ResaleListResponse } from '../types/resale';

const formatCategory = (category?: string | string[]): string | undefined => {
  if (!category) return undefined;
  return Array.isArray(category) ? category.join(',') : category;
};

export const getResaleProductList = async (
  params: GetResaleListParams = {}
): Promise<ResaleListResponse> => {
  const { category, ...rest } = params;

  const response = await api.get<ResaleListResponse>('/resale/items/search', {
    params: {
      ...rest,
      category: formatCategory(category),
    },
  });

  return response.data;
};

import { GetProductListParams, ProductType } from './types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (type: ProductType, params: GetProductListParams) =>
    [...productKeys.lists(), type, params] as const,
  details: () => ['product'] as const,
  detail: (type: ProductType, id: number) => [...productKeys.details(), type, id] as const,
};

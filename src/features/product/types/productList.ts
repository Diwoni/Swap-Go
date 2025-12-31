export type ProductType = 'resale' | 'rental';

export type GetProductListParams = {
  region?: string;
  category?: string | string[];
  isAvailable?: boolean;
  dealType?: string;
  keyword?: string;
  priceRange?: string;
  cursor?: number;
};

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  deposit: number | null;
  region: string;
  dealType: string;
  category: string;
  status: boolean;
  isLiked: boolean;
  thumbnailUrl: string;
  createdAt: string;
};

export type ProductListResponse = {
  count: number;
  nextCursor: number | null;
  hasNext: boolean;
  items: ProductItem[];
};

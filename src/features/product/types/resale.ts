export type GetResaleListParams = {
  region?: string;
  category?: string | string[];
  isAvailable?: boolean;
  dealType?: string;
  keyword?: string;
  priceRange?: string;
  cursor?: number;
};

export type ResaleListResponse = {
  count: number;
  nextCursor: number | null;
  hasNext: boolean;
  items: {
    id: number;
    title: string;
    deposit: null;
    price: number;
    region: string;
    dealType: string;
    category: string;
    status: boolean;
    isLiked: boolean;
    thumbnailUrl: string;
    createdAt: string;
  }[];
};

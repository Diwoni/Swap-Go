export type ListingRequest = {
  title: string;
  itemType: 'resale' | 'rental';
  content: string;
  category: string;
  deposit?: number | null;
  price: number;
  dealType: 'BUY' | 'SELL';
  region: string;
  images: string[];
};

export type CreateListingRequest = Omit<ListingRequest, 'images'>;

export type ListingResponse = {
  itemId: number;
  message: string;
};

import { RecentPostBySeller } from './productList';

export type ResaleProductDetail = {
  itemId: number;
  title: string;
  content: string;
  price: number;
  region: string;
  category: string;
  isMine: boolean;
  isLiked: boolean;
  isAvailable: boolean; // 거래가 가능한 상태인지
  createdAt: string;
  images: string[];
  seller: {
    sellerId: number;
    username: string;
  };
  recentPostsBySeller: RecentPostBySeller[];
};

export type RentalProductDetail = ResaleProductDetail & {
  deposit: number;
  rentalInfo: {
    isCurrentlyRented: boolean;
    rentedFrom: string;
    rentedUntil: string;
  };
};

export type ResaleProductDetail = {
  itemId: number;
  title: string;
  content: string;
  price: number;
  region: string;
  category: string;
  isMine: boolean;
  isLiked: boolean;
  status: boolean; // 거래가 가능한 상태인지
  createdAt: string;
  images: string[];
  seller: {
    sellerId: number;
    nickname: string;
  };
  recentPostsBySeller: {
    productId: number;
    thumbnail: string;
    price: number;
    isLiked: boolean;
    itemType: string;
    createdAt: string;
  }[];
};

export type RentalProductDetail = {
  itemId: number;
  title: string;
  content: string;
  deposit: number;
  price: number;
  region: string;
  category: string;
  isMine: boolean;
  isLiked: boolean;
  status: boolean; // 거래가 가능한 상태인지
  createdAt: string;
  images: string[];
  rentalInfo: {
    isCurrentlyRented: boolean; // 거래가 가능한 상태인지
    rentedFrom: string;
    rentedUntil: string;
  };
  seller: {
    sellerId: number;
    nickname: string;
  };
  recentPostsBySeller: {
    productId: number;
    thumbnail: string;
    price: number;
    isLiked: boolean;
    itemType: string;
    createdAt: string;
  }[];
};

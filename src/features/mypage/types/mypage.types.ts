// 프로필
export interface MyProfile {
  email: string;
  username: string;
  address: {
    country: string;
    region: string;
    street?: string;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  address?: {
    country: string;
    region: string;
    street?: string;
  };
  password?: string;
}

export interface DeleteAccountRequest {
  password: string;
}

// 내 상품
export interface MyItem {
  itemId: number;
  title: string;
  price: number;
  deposit: number | null;
  region: string;
  dealType: string;
  category: string;
  isAvailable: boolean;
  isLiked: boolean;
  thumbnailUrl: string;
  createdAt: string;
}

export interface MyItemsResponse {
  count: number;
  nextCursor: string | null;
  hasNext: boolean;
  items: MyItem[];
}

// 거래요청
export type TradeOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
export type ItemType = 'rental' | 'resale';

export interface TradeOffer {
  tradeOfferId: number;
  transactionId: number | null;
  itemId: number;
  itemType: ItemType;
  itemTitle: string;
  requesterId: number;
  requesterName: string;
  ownerId: number;
  ownerName: string;
  status: TradeOfferStatus;
  createdAt: string;
  startAt: string | null;
  endAt: string | null;
}

export interface UpdateTradeOfferRequest {
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELED';
}

export interface UpdateTradeOfferResponse {
  tradeOfferId: number;
  itemId: number;
  requesterId: number;
  status: TradeOfferStatus;
  createdAt: string;
  startAt: string | null;
  endAt: string | null;
}

// 거래내역 (구매/판매)
export type EarlyReturnStatus = 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
export type ItemStatus = 'ACTIVE' | 'RENTED' | 'COMPLETED';

export interface Transaction {
  transactionId: number;
  itemId: number;
  itemTitle: string;
  itemThumbnailUrl: string;
  itemPrice: number;
  itemLocation: string;
  itemType: ItemType;
  itemStatus: ItemStatus;
  isLiked: boolean;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  startAt: string | null;
  endAt: string | null;
  earlyReturnStatus: EarlyReturnStatus | null;
  createdAt: string;
}

// 조기반납 요청
export interface EarlyReturnRequest {
  newEndAt: string;
}

export interface EarlyReturnUpdateRequest {
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELED';
}

export interface EarlyReturnResponse {
  transactionId: number;
  itemId: number;
  requesterId: number;
  status: EarlyReturnStatus;
  requestedAt: string;
  earlyReturnAt: string;
  currentEndAt: string;
}

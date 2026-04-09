export const mypageKeys = {
  all: ['mypage'] as const,
  profile: () => [...mypageKeys.all, 'profile'] as const,
  myItems: () => [...mypageKeys.all, 'items'] as const,
  wishlist: () => [...mypageKeys.all, 'wishlist'] as const,
  tradeOffers: () => [...mypageKeys.all, 'tradeOffers'] as const,
  sentTradeOffers: () => [...mypageKeys.tradeOffers(), 'sent'] as const,
  receivedTradeOffers: () => [...mypageKeys.tradeOffers(), 'received'] as const,
  transactions: () => [...mypageKeys.all, 'transactions'] as const,
  buyerTransactions: () => [...mypageKeys.transactions(), 'buyer'] as const,
  sellerTransactions: () => [...mypageKeys.transactions(), 'seller'] as const,
};

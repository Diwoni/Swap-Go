export type ResaleTradeRequest = {
  itemId: number;
};

export type RentalTradeRequest = {
  itemId: number;
  startDate: string;
  endDate: string;
};

export type ResaleTradeResponse = {
  requestId: number;
  itemId: number;
  receiverId: number;
  status: string;
  createdAt: string;
};

export type RentalTradeResponse = {
  requestId: number;
  itemId: number;
  receiverId: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

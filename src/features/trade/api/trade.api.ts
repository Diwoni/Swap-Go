import { api } from '@/shared/utils';

import {
  RentalTradeRequest,
  RentalTradeResponse,
  ResaleTradeRequest,
  ResaleTradeResponse,
} from '../types/trade';

export const requestResaleTrade = async (itemId: ResaleTradeRequest) => {
  const response = await api.post<ResaleTradeResponse>('/tradeoffers/resale', itemId);
  return response.data;
};

export const requestRentalTrade = async (data: RentalTradeRequest) => {
  const response = await api.post<RentalTradeResponse>('/tradeoffers/rental', data);
  return response.data;
};

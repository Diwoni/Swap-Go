import { api } from '@/shared/utils';

import {
  TradeOffer,
  UpdateTradeOfferRequest,
  UpdateTradeOfferResponse,
} from '../types/mypage.types';

export const tradeOfferApi = {
  getSentTradeOffers: async (): Promise<TradeOffer[]> => {
    const response = await api.get<TradeOffer[]>('/tradeoffers', {
      params: { role: 'sender' },
    });
    return response.data;
  },

  getReceivedTradeOffers: async (): Promise<TradeOffer[]> => {
    const response = await api.get<TradeOffer[]>('/tradeoffers', {
      params: { role: 'receiver' },
    });
    return response.data;
  },

  updateTradeOffer: async (
    tradeOfferId: number,
    data: UpdateTradeOfferRequest
  ): Promise<UpdateTradeOfferResponse> => {
    const response = await api.patch<UpdateTradeOfferResponse>(
      `/tradeoffers/${tradeOfferId}`,
      data
    );
    return response.data;
  },
};

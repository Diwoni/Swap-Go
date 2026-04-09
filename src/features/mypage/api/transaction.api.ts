import { api } from '@/shared/utils';

import {
  EarlyReturnRequest,
  EarlyReturnResponse,
  EarlyReturnUpdateRequest,
  Transaction,
} from '../types/mypage.types';

export const transactionApi = {
  getBuyerTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions/buyer');
    return response.data;
  },

  getSellerTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions/seller');
    return response.data;
  },

  requestEarlyReturn: async (
    transactionId: number,
    data: EarlyReturnRequest
  ): Promise<EarlyReturnResponse> => {
    const response = await api.post<EarlyReturnResponse>(
      `/transactions/${transactionId}/early-return`,
      data
    );
    return response.data;
  },

  updateEarlyReturn: async (
    transactionId: number,
    data: EarlyReturnUpdateRequest
  ): Promise<EarlyReturnResponse> => {
    const response = await api.patch<EarlyReturnResponse>(
      `/transactions/${transactionId}/early-return`,
      data
    );
    return response.data;
  },
};

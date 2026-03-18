import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { requestRentalTrade, requestResaleTrade } from '../api/trade.api';
import {
  RentalTradeRequest,
  RentalTradeResponse,
  ResaleTradeRequest,
  ResaleTradeResponse,
} from '../types/trade';

export const useRequestResaleTrade = (): UseMutationResult<
  ResaleTradeResponse,
  AxiosError,
  ResaleTradeRequest
> => {
  return useMutation({
    mutationFn: (itemId) => requestResaleTrade(itemId),
  });
};

export const useRequestRentalTrade = (): UseMutationResult<
  RentalTradeResponse,
  AxiosError,
  RentalTradeRequest
> => {
  return useMutation({
    mutationFn: (data) => requestRentalTrade(data),
  });
};

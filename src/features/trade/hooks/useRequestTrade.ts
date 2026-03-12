import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { handleAPIError } from '@/shared/utils';

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
    onError: (err) => toast.error(handleAPIError(err)),
  });
};

export const useRequestRentalTrade = (): UseMutationResult<
  RentalTradeResponse,
  AxiosError,
  RentalTradeRequest
> => {
  return useMutation({
    mutationFn: (data) => requestRentalTrade(data),
    onError: (err) => toast.error(handleAPIError(err)),
  });
};

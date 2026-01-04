import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
    onSuccess: (data) => console.log(data), // TODO : 내 거래 내역 리스트 갱신 등의 쿼리 무효화
    onError: (err) => handleAPIError(err),
  });
};

export const useRequestRentalTrade = (): UseMutationResult<
  RentalTradeResponse,
  AxiosError,
  RentalTradeRequest
> => {
  return useMutation({
    mutationFn: (data) => requestRentalTrade(data),
    onSuccess: (data) => console.log(data), // TODO : 모달 닫기 & 내 거래 내역 리스트 갱신 등의 쿼리 무효화
    onError: (err) => handleAPIError(err),
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { transactionApi } from '../api/transaction.api';
import { mypageKeys } from '../queryKeys';
import { EarlyReturnRequest, EarlyReturnUpdateRequest, Transaction } from '../types/mypage.types';

export const useBuyerTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: mypageKeys.buyerTransactions(),
    queryFn: transactionApi.getBuyerTransactions,
    throwOnError: true,
  });

  const transactions: Transaction[] = data ?? [];

  const activeRentals = transactions.filter(
    (t) => t.itemType === 'rental' && t.itemStatus === 'RENTED'
  );
  const completedTransactions = transactions.filter((t) => t.itemStatus === 'COMPLETED');
  const isEmpty = !isLoading && transactions.length === 0;

  return { transactions, activeRentals, completedTransactions, isLoading, isEmpty };
};

export const useSellerTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: mypageKeys.sellerTransactions(),
    queryFn: transactionApi.getSellerTransactions,
    throwOnError: true,
  });

  const transactions: Transaction[] = data ?? [];

  const activeRentals = transactions.filter(
    (t) => t.itemType === 'rental' && t.itemStatus === 'RENTED'
  );
  const completedTransactions = transactions.filter((t) => t.itemStatus === 'COMPLETED');
  const isEmpty = !isLoading && transactions.length === 0;

  return { transactions, activeRentals, completedTransactions, isLoading, isEmpty };
};

export const useRequestEarlyReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: number; data: EarlyReturnRequest }) =>
      transactionApi.requestEarlyReturn(transactionId, data),
    onSuccess: () => {
      toast.success('조기 반납 요청이 완료되었습니다.');
      void queryClient.invalidateQueries({ queryKey: mypageKeys.transactions() });
    },
  });
};

export const useUpdateEarlyReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: number;
      data: EarlyReturnUpdateRequest;
    }) => transactionApi.updateEarlyReturn(transactionId, data),
    onSuccess: (_, { data }) => {
      const messages = {
        ACCEPTED: '조기 반납 요청을 수락했습니다.',
        REJECTED: '조기 반납 요청을 거절했습니다.',
        CANCELED: '조기 반납 요청을 취소했습니다.',
      };
      toast.success(messages[data.status]);
      void queryClient.invalidateQueries({ queryKey: mypageKeys.transactions() });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { tradeOfferApi } from '../api/tradeOffer.api';
import { mypageKeys } from '../queryKeys';
import { UpdateTradeOfferRequest } from '../types/mypage.types';

export const useSentTradeOffers = () => {
  const { data, isLoading } = useQuery({
    queryKey: mypageKeys.sentTradeOffers(),
    queryFn: tradeOfferApi.getSentTradeOffers,
    throwOnError: true,
  });

  const tradeOffers = data ?? [];
  const isEmpty = !isLoading && tradeOffers.length === 0;

  return { tradeOffers, isLoading, isEmpty };
};

export const useReceivedTradeOffers = () => {
  const { data, isLoading } = useQuery({
    queryKey: mypageKeys.receivedTradeOffers(),
    queryFn: tradeOfferApi.getReceivedTradeOffers,
    throwOnError: true,
  });

  const tradeOffers = data ?? [];
  const isEmpty = !isLoading && tradeOffers.length === 0;

  return { tradeOffers, isLoading, isEmpty };
};

export const useUpdateTradeOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeOfferId, data }: { tradeOfferId: number; data: UpdateTradeOfferRequest }) =>
      tradeOfferApi.updateTradeOffer(tradeOfferId, data),
    onSuccess: (_, { data }) => {
      const messages = {
        ACCEPTED: '거래 요청을 수락했습니다.',
        REJECTED: '거래 요청을 거절했습니다.',
        CANCELED: '거래 요청을 취소했습니다.',
      };
      toast.success(messages[data.status]);
      void queryClient.invalidateQueries({ queryKey: mypageKeys.tradeOffers() });
    },
  });
};

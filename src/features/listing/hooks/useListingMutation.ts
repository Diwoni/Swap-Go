import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { handleAPIError } from '../../../shared/utils';
import { deleteListing, updateListing } from '../api/listing.api';
import { ListingRequest, ListingResponse } from '../types/listing.types';

const formatListingPayload = (data: ListingRequest): ListingRequest => {
  if (data.itemType === 'resale') {
    return { ...data, deposit: null };
  }
  return data;
};

type UpdateParams = {
  itemId: number;
  data: ListingRequest;
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation<ListingResponse, AxiosError, UpdateParams>({
    mutationFn: ({ itemId, data }) => {
      const payload = formatListingPayload(data);
      return updateListing(itemId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error) => {
      handleAPIError(error);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation<ListingResponse, AxiosError, number>({
    mutationFn: (itemId: number) => deleteListing(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

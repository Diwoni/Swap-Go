import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { handleAPIError } from '@/shared/utils';

import { productKeys } from '../../product/hooks/useGetProductList';
import { createListing } from '../api/listing.api';
import { CreateListingRequest, ListingResponse } from '../types/listing.types';

type CreateParams = {
  data: CreateListingRequest;
  images: File[];
};

export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ListingResponse, AxiosError, CreateParams>({
    mutationFn: ({ data, images }) => createListing(data, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('게시물이 등록되었습니다.');
    },
    onError: (error) => {
      const message = handleAPIError(error);
      toast.error(message);
    },
  });
};

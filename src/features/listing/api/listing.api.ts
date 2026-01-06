import { api } from '@/shared/utils';

import { ListingRequest, ListingResponse } from '../types/listing.types';

export const updateListing = async (itemId: number, data: ListingRequest) => {
  const response = await api.patch<ListingResponse>(`/items/${itemId}`, data);
  return response.data;
};

export const deleteListing = async (itemId: number) => {
  const response = await api.delete<ListingResponse>(`/items/${itemId}`);
  return response.data;
};

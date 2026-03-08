import { api } from '@/shared/utils';

import { CreateListingRequest, ListingRequest, ListingResponse } from '../types/listing.types';

export const updateListing = async (itemId: number, data: ListingRequest) => {
  const response = await api.patch<ListingResponse>(`/items/${itemId}`, data);
  return response.data;
};

export const createListing = async (data: CreateListingRequest, images: File[]) => {
  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify(data)], {
      type: 'application/json',
    })
  );
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post<ListingResponse>('/items', formData);
  return response.data;
};

export const deleteListing = async (itemId: number) => {
  const response = await api.delete<ListingResponse>(`/items/${itemId}`);
  return response.data;
};

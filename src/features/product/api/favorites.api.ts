import { api } from '@/shared/utils/axios';

import { FavoriteRequest, FavoriteResponse } from '../types';

export const addFavorite = async (itemId: FavoriteRequest): Promise<FavoriteResponse> => {
  const response = await api.post<FavoriteResponse>(`/favorites/${itemId}`);
  return response.data;
};

export const deleteFavorite = async (itemId: FavoriteRequest): Promise<FavoriteResponse> => {
  const response = await api.delete<FavoriteResponse>(`/favorites/${itemId}`);
  return response.data;
};

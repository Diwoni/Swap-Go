import { api } from '@/shared/utils';

import {
  DeleteAccountRequest,
  MyItemsResponse,
  MyProfile,
  UpdateProfileRequest,
} from '../types/mypage.types';

export const mypageApi = {
  getProfile: async (): Promise<MyProfile> => {
    const response = await api.get<MyProfile>('/mypage/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>('/mypage/profile', data);
    return response.data;
  },

  deleteAccount: async (data: DeleteAccountRequest): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/mypage/profile', { data });
    return response.data;
  },

  getMyItems: async (): Promise<MyItemsResponse> => {
    const response = await api.get<MyItemsResponse>('/mypage/items');
    return response.data;
  },

  getWishlist: async (): Promise<MyItemsResponse> => {
    const response = await api.get<MyItemsResponse>('/mypage/wishlist');
    return response.data;
  },
};

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { addFavorite, deleteFavorite } from '../api/favorites.api';

export const useProductLike = (initialState: boolean, productId: number) => {
  // const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(initialState);

  // 리스트가 새로고침되어 props 가 바뀌면 state 도 동기화
  useEffect(() => {
    setIsLiked(initialState);
  }, [initialState]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      return isLiked ? await deleteFavorite(productId) : await addFavorite(productId);
    },

    // 굳이 리스트 서버 상태랑 동기화하고 재호출해야하나? UI만 업데이트해놓아도 괜찮을 듯
    // onSuccess: () => {
    //   if (queryKey) {
    //     queryClient.invalidateQueries({ queryKey });
    //   }
    // },

    onError: () => {
      setIsLiked((prev) => !prev); // 다시 되돌리기
      toast.error('오류가 발생하여 찜할수 없습니다.');
    },
  });

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    mutate();
  };

  return { isLiked, toggleLike };
};

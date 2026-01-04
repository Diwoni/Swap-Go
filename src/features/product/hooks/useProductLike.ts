import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { addFavorite, deleteFavorite } from '../api/favorites.api';

export const useProductLike = (initialState: boolean, itemId: number) => {
  const [isLiked, setIsLiked] = useState(initialState);

  // 리스트가 새로고침되어 props 가 바뀌면 state 도 동기화
  useEffect(() => {
    setIsLiked(initialState);
  }, [initialState]);

  const { mutate } = useMutation({
    mutationFn: async (isLikedState: boolean) => {
      return isLikedState ? await deleteFavorite(itemId) : await addFavorite(itemId);
    },

    onError: () => {
      setIsLiked((prev) => !prev); // 다시 되돌리기
      toast.error('오류가 발생하여 찜할수 없습니다.');
    },
  });

  const toggleLike = () => {
    const currentStatus = isLiked;
    // 낙관전 UI 업데이트
    setIsLiked((prev) => !prev);

    // API 요청 시에는 변하지 않은 클릭 시점의 상태를 전달
    mutate(currentStatus);
  };

  return { isLiked, toggleLike };
};

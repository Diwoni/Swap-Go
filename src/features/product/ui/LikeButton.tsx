import { MouseEvent } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  onToggle: () => void;
};

export const LikeButton = ({ isLiked, onToggle }: LikeButtonProps) => {
  const clickLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // 좋아요 버튼 눌렀을 때 상품 상세 페이지 이동 X

    onToggle(); // 비지니스 로직 (찜하기 API 호출)
  };

  return (
    <button
      onClick={clickLike}
      className="z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? 'red' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

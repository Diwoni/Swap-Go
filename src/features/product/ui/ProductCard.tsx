import { Link } from 'react-router-dom';

import { useProductLike } from '../hooks/useProductLike';
import { LikeButton } from './LikeButton';

type ProductCardProps = {
  type: string; // 중고거래인지 단기렌탈인지
  id: number;
  title: string;
  imageUrl: string;
  deposit?: number;
  price: number;
  region: string;
  createdAt: string;
  liked: boolean;
};

export const ProductCard = ({
  id,
  title,
  imageUrl,
  price,
  region,
  createdAt,
  liked = false,
}: ProductCardProps) => {
  const { isLiked, toggleLike } = useProductLike(liked, id);

  return (
    <Link to={`/products/${id}`} className="block">
      <article className="w-[300px] h-[400px]">
        <div className="w-full h-[300px] border relative rounded-xl">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute bottom-1 right-1">
            <LikeButton isLiked={isLiked} onToggle={toggleLike} />
          </div>
        </div>
        <div className="flex flex-col px-2 py-2">
          <span className="font-bold">{title}</span>
          <span className="font-bold">{price}원</span>
          <div className="flex justify-between text-sm">
            <span>{region}</span>
            <span>{createdAt}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

import { Link } from 'react-router-dom';

import { formatDate, formatPrice } from '../../../shared/utils';
import { useProductLike } from '../hooks/useProductLike';
import { LikeButton } from './LikeButton';

type ProductCardProps = {
  itemType: string;
  itemId: number;
  title: string;
  deposit: number | null;
  thumbnailUrl: string;
  price: number;
  region: string;
  createdAt: string;
  isliked: boolean;
};

export const ProductCard = ({
  itemType,
  itemId,
  title,
  thumbnailUrl,
  deposit,
  price,
  region,
  createdAt,
  isliked = false,
}: ProductCardProps) => {
  const { isLiked, toggleLike } = useProductLike(isliked, itemId);

  return (
    <Link to={`/product/${itemType}/${itemId}`} className="block">
      <article className="w-[300px] h-[400px]">
        <div className="w-full h-[300px] border relative rounded-xl">
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
          <div className="absolute bottom-1 right-1">
            <LikeButton isLiked={isLiked} onToggle={toggleLike} />
          </div>
        </div>
        <div className="flex flex-col px-1 py-2">
          <span className="font-bold text-base truncate block" title={title}>
            {title}
          </span>

          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{formatPrice(price)}원</span>
            {deposit !== null && deposit !== undefined && (
              <span className="text-sm text-gray-500 font-medium">
                보증금 {formatPrice(deposit)}원
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm text-black-150 mt-1">
            <span>{region}</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

import { Link } from 'react-router-dom';

import { useProductLike } from '../hooks/useProductLike';
import { LikeButton } from './LikeButton';

type ProductCardProps = {
  productType: string;
  id: number;
  title: string;
  deposit: number | null;
  imageUrl: string;
  price: number;
  region: string;
  createdAt: string;
  liked: boolean;
};

export const ProductCard = ({
  productType,
  id,
  title,
  imageUrl,
  deposit,
  price,
  region,
  createdAt,
  liked = false,
}: ProductCardProps) => {
  const { isLiked, toggleLike } = useProductLike(liked, id);

  return (
    <Link to={`/products/${productType}/${id}`} className="block">
      <article className="w-[300px] h-[400px]">
        <div className="w-full h-[300px] border relative rounded-xl">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
          <div className="absolute bottom-1 right-1">
            <LikeButton isLiked={isLiked} onToggle={toggleLike} />
          </div>
        </div>
        <div className="flex flex-col px-1 py-2">
          <span className="font-bold text-base truncate block" title={title}>
            {title}
          </span>

          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{price.toLocaleString()}원</span>
            {deposit !== null && deposit !== undefined && (
              <span className="text-sm text-gray-500 font-medium">
                보증금 {deposit.toLocaleString()}원
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm text-black-150 mt-1">
            <span>{region}</span>
            <span>{createdAt}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

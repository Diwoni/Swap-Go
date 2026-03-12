import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { RecentPostBySeller } from '../types';
import { ProductCard } from './ProductCard';

type Props = {
  title: string;
  products: RecentPostBySeller[];
};

export const ProductCarousel = ({ title, products }: Props) => {
  const itemsPerPage = useResponsiveItemsCount();
  const { visibleItems, hasPrev, hasNext, onPrev, onNext } = useCarouselPagination(
    products,
    itemsPerPage
  );

  if (products.length === 0) return null;

  const showNavigation = products.length > itemsPerPage;

  return (
    <div className="w-full items-center px-8 py-8">
      <h2 className="text-[20px] font-bold text-gray-900 mb-6 px-2">{title}</h2>

      <div className="flex relative mx-auto max-w-[1100px] justify-center">
        {showNavigation && <ArrowButton direction="left" disabled={!hasPrev} onClick={onPrev} />}

        {/* 아이템 리스트 */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleItems.map((item) => (
              <div key={item.itemId} className="w-full flex justify-center">
                <ProductCard
                  itemId={item.itemId}
                  itemType={item.itemType}
                  title={item.title}
                  thumbnailUrl={item.thumbnailUrl}
                  price={item.price}
                  deposit={item.deposit ?? null}
                  region={item.region || '정보 없음'}
                  createdAt={item.createdAt}
                  isliked={item.isLiked}
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && <ArrowButton direction="right" disabled={!hasNext} onClick={onNext} />}
      </div>
    </div>
  );
};

type ArrowButtonProps = {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
};

const ArrowButton = ({ direction, disabled, onClick }: ArrowButtonProps) => {
  const positionClass = direction === 'left' ? 'left-0' : 'right-0';
  const Icon = direction === 'left' ? IoIosArrowBack : IoIosArrowForward;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border bg-white shadow-sm transition-all ${
        disabled
          ? 'text-gray-300 border-gray-200 cursor-not-allowed opacity-50'
          : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-md'
      }`}
      aria-label={`${direction === 'left' ? 'Previous' : 'Next'} slide`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

const useResponsiveItemsCount = () => {
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(1);
      else if (width < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return itemsPerPage;
};

const useCarouselPagination = <T,>(items: T[], itemsPerPage: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleItems = useMemo(() => {
    return items.slice(currentIndex, currentIndex + itemsPerPage);
  }, [items, currentIndex, itemsPerPage]);

  const maxIndex = Math.max(0, items.length - itemsPerPage);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < maxIndex;

  const onPrev = useCallback(() => {
    if (hasPrev) setCurrentIndex((prev) => prev - 1);
  }, [hasPrev]);

  const onNext = useCallback(() => {
    if (hasNext) setCurrentIndex((prev) => prev + 1);
  }, [hasNext]);

  return {
    visibleItems,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
  };
};

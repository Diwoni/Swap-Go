import { ProductCard } from '@/features/product/ui';

import { useMyItems } from '../hooks/useMyItems';

const DEAL_TYPE_TO_ITEM_TYPE: Record<string, string> = {
  SELL: 'resale',
  RENT: 'rental',
};

export const MyItemsSection = () => {
  const { items, isLoading, isEmpty } = useMyItems();

  if (isLoading) {
    return (
      <section>
        <h2 className="font-semibold text-base mb-4">내 상품</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section>
        <h2 className="font-semibold text-base mb-4">내 상품</h2>
        <p className="text-sm text-gray-400">등록한 상품이 없습니다.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-semibold text-base mb-4">내 상품</h2>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.itemId}
            itemType={DEAL_TYPE_TO_ITEM_TYPE[item.dealType] ?? 'resale'}
            itemId={item.itemId}
            title={item.title}
            price={item.price}
            deposit={item.deposit}
            thumbnailUrl={item.thumbnailUrl}
            region={item.region}
            createdAt={item.createdAt}
            isliked={item.isLiked}
          />
        ))}
      </div>
    </section>
  );
};

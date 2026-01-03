import sampleImg from '../../assets/image.png';
import { ProductItem } from '../../features/product/types';

export const MOCK_RENTAL_PRODUCTS: ProductItem[] = Array.from({ length: 50 })
  .map((_, index) => {
    const id = index + 1000;
    const isAvailable = index % 5 !== 0;

    const dealType = index % 2 === 0 ? 'BUY' : 'SELL';

    return {
      itemId: id,
      title: `[렌탈] 맥북 프로 M${(index % 3) + 1} 대여합니다 (${id}번)`,
      deposit: (index + 1) * 5000,
      price: (index + 1) * 1000,
      region: index % 2 === 0 ? 'Warsaw' : 'Ulm',

      dealType: dealType,

      category: index % 2 === 0 ? '전자기기' : '가구',
      isAvailable: isAvailable,
      isLiked: index % 3 === 0,
      thumbnailUrl: sampleImg,
      createdAt: new Date(Date.now() - (50 - index) * 1000 * 60 * 60).toISOString(),
    };
  })
  .reverse();

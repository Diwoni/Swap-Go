import { Navigate } from 'react-router-dom';

import { useProductDetailPage } from '../features/product/hooks/useProductDetailPage';
import { ProductCarousel } from '../features/product/ui/ProductCarousel'; // ✨ Carousel 직접 import
import { ProductDetailCard } from '../features/product/ui/ProductDetailCard';

const ProductDetailPage = () => {
  const { type, data, resaleItems, rentalItems, isLoading, isError } = useProductDetailPage();

  if (isLoading) return <div>로딩 중...</div>;

  const isValidType = type === 'resale' || type === 'rental';

  if (isError || !data || !type || !isValidType) {
    return <Navigate to="/" replace />;
  }
  const sellerName = data.seller.username;

  return (
    <div className="flex flex-col items-center justify-center">
      <ProductDetailCard type={type} productData={data} />

      <div className="w-full flex-col justify-center pb-20">
        {resaleItems.length > 0 && (
          <ProductCarousel title={`${sellerName} 님이 올린 중고거래 물품`} products={resaleItems} />
        )}

        {rentalItems.length > 0 && (
          <ProductCarousel title={`${sellerName} 님이 올린 렌탈 물품`} products={rentalItems} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

import { Navigate } from 'react-router-dom';

import { useProductDetailPage } from '../features/product/hooks/useProductDetailPage';
import { ProductCarousel } from '../features/product/ui/ProductCarousel';
import { ProductDetailCard } from '../features/product/ui/ProductDetailCard';

const ProductDetailPage = () => {
  const { type, data, resaleItems, rentalItems, isLoading } = useProductDetailPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-500" />
      </div>
    );
  }

  const isValidType = type === 'resale' || type === 'rental';

  if (!data || !type || !isValidType) {
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

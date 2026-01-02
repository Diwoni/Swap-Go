import { Navigate } from 'react-router-dom';

import { useProductDetailPage } from '../features/product/hooks/useProductDetailPage';
import { ProductDetailCard } from '../features/product/ui/ProductDetailCard';

const ProductDetailPage = () => {
  const { type, data, isLoading, isError } = useProductDetailPage();

  if (isLoading) return <div>로딩 중...</div>;

  const isValidType = type === 'resale' || type === 'rental';

  if (isError || !data || !type || !isValidType) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <ProductDetailCard type={type} productData={data} />
    </div>
  );
};

export default ProductDetailPage;

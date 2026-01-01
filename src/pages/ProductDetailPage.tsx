import { Navigate } from 'react-router-dom';

import { useProductDetailPage } from '../features/product/hooks/useProductDetailPage';

const ProductDetailPage = () => {
  const { type, data, isLoading, isError } = useProductDetailPage();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data || !type) return <Navigate to="/" replace />;

  return <div>{data.title} 게시물 상세페이지</div>;
};

export default ProductDetailPage;

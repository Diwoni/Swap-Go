import { Navigate, useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { type, itemId } = useParams<{ type: string; itemId: string }>();
  if (!itemId || (type !== 'resale' && type !== 'rental')) {
    return <Navigate to="/" replace />;
  }
  return <div>{type} 게시물 상세페이지</div>;
};

export default ProductDetailPage;

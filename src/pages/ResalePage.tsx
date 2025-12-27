import { ProductCard } from '../features/product/ui/ProductCard';

const ResalePage = () => {
  return (
    <>
      <ProductCard
        id={1}
        title="소니 WHX-1000 헤드셋"
        imageUrl=""
        price={50000}
        region="Warszawa, Poland"
        createdAt="2025-12-25"
        liked={false}
      />
    </>
  );
};

export default ResalePage;

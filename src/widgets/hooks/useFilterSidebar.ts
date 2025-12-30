import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPriceRange = searchParams.get('priceRange')?.split('-') ?? ['', ''];
  const [region, setRegion] = useState<string | undefined>(searchParams.get('region') ?? undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(initialPriceRange[0] ?? '');
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1] ?? '');

  // url과 사이드바 값 동기화
  useEffect(() => {
    const catParam = searchParams.get('category');
    setCategories(catParam ? catParam.split(',') : []);

    const rangeParam = searchParams.get('priceRange');
    if (rangeParam) {
      const [min, max] = rangeParam.split('-');
      setMinPrice(min ?? '');
      setMaxPrice(max ?? '');
    } else {
      setMinPrice('');
      setMaxPrice('');
    }

    setRegion(searchParams.get('region') ?? undefined);
  }, [searchParams]);

  const handleCategoryChange = useCallback((selected: string[]) => {
    setCategories(selected);
  }, []);

  const handlePriceChange = useCallback((min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  }, []);

  const handleReset = useCallback(() => {
    setRegion(undefined);
    setCategories([]);
    setMinPrice('');
    setMaxPrice('');
  }, []);

  const applyFilters = useCallback(() => {
    const params: Record<string, string> = {};

    if (region) params.region = region;
    if (categories.length > 0) params.category = categories.join(',');
    if (minPrice || maxPrice) {
      params.priceRange = `${minPrice}-${maxPrice}`;
    }
    setSearchParams(params);
  }, [region, categories, minPrice, maxPrice, setSearchParams]);

  return {
    state: { region, categories, minPrice, maxPrice },
    actions: {
      setRegion,
      handleCategoryChange,
      handlePriceChange,
      handleReset,
      applyFilters,
    },
  };
};

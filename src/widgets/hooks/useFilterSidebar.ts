import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPriceRange = searchParams.get('priceRange')?.split('-') ?? ['', ''];
  const [region, setRegion] = useState<string | undefined>(searchParams.get('region') ?? undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(initialPriceRange[0] ?? '');
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1] ?? '');
  const [dealType, setDealType] = useState<string | undefined>(
    searchParams.get('dealType') ?? undefined
  );
  const [isAvailable, setIsAvailable] = useState<boolean>(
    searchParams.get('isAvailable') === 'true'
  );

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
    setDealType(searchParams.get('dealType') ?? undefined);
    setIsAvailable(searchParams.get('isAvailable') === 'true');
  }, [searchParams]);

  const handleCategoryChange = useCallback((selected: string[]) => {
    setCategories(selected);
  }, []);

  const handlePriceChange = useCallback((min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  }, []);

  const handleDealTypeChange = useCallback((type: string | undefined) => {
    setDealType(type);
  }, []);

  const handleIsAvailableChange = useCallback((checked: boolean) => {
    setIsAvailable(checked);
  }, []);

  const handleReset = useCallback(() => {
    setRegion(undefined);
    setCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setDealType(undefined);
    setIsAvailable(false);
  }, []);

  const applyFilters = useCallback(() => {
    const params: Record<string, string> = {};

    if (region) params.region = region;
    if (categories.length > 0) params.category = categories.join(',');
    if (minPrice || maxPrice) {
      params.priceRange = `${minPrice}-${maxPrice}`;
    }
    if (dealType) {
      params.dealType = dealType;
    }

    if (isAvailable) {
      params.isAvailable = 'true';
    }

    setSearchParams(params);
  }, [region, categories, minPrice, maxPrice, dealType, isAvailable, setSearchParams]);

  return {
    state: { region, categories, minPrice, maxPrice, dealType, isAvailable },
    actions: {
      setRegion,
      handleCategoryChange,
      handlePriceChange,
      handleDealTypeChange,
      handleIsAvailableChange,
      handleReset,
      applyFilters,
    },
  };
};

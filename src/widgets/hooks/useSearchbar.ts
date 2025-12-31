import { useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveSearchHistoryToLocalStorage } from '../../shared/utils/saveSearchHistoryToLocalStorage';
import { TradeType } from '../ui/SearchBar/components/TradeTypeSelector';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = ['places'];
type ActiveSection = 'LOCATION' | 'CATEGORY' | 'KEYWORD' | null;

export const useSearchbar = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Google Map
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
    language: 'en',
  });

  // state
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [tradeType, setTradeType] = useState<TradeType>('resale');
  const [searchData, setSearchData] = useState({
    location: '',
    category: '',
    keyword: '',
  });

  // 외부 클릭 시 드롭다운 메뉴 비활성화
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // data 업데이트 핸들러 (setSearchData 대신 이 핸들러를 전달해서 로직 추상화)
  const updateSearchData = useCallback((key: keyof typeof searchData, value: string) => {
    setSearchData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 검색 실행 로직 (조건부 라우팅 & 히스토리 저장)
  const handleSearch = useCallback(() => {
    const { location, keyword, category } = searchData;

    if (location) saveSearchHistoryToLocalStorage('recent_locations', location);
    if (keyword) saveSearchHistoryToLocalStorage('recent_keywords', keyword);

    const params = new URLSearchParams();
    if (location) params.set('region', location);
    if (category) params.set('category', category);
    if (keyword) params.set('keyword', keyword);

    setActiveSection(null);

    const basePath = tradeType === 'resale' ? '/resale' : '/rental';
    navigate(`${basePath}?${params.toString()}`);
  }, [searchData, tradeType, navigate]);

  return {
    refs: { containerRef },
    state: { isLoaded, activeSection, tradeType, searchData },
    actions: {
      setActiveSection,
      setTradeType,
      updateSearchData,
      handleSearch,
    },
  };
};

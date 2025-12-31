import { useEffect, useRef, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';

export const useLocationSearch = (isLoaded: boolean, onSelect: (address: string) => void) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    initOnMount: isLoaded,
    requestOptions: {
      types: ['(regions)'], // 지역 단위 검색
    },
    debounce: 300,
  });

  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent_locations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentLocations(parsed);
        }
      } catch (error) {
        console.error('최근 검색어를 불러오는 도중 오류가 발생했습니다. :', error);
      }
    }
  }, []);

  // 스크립트 로드 상태가 변할 때 훅 수동 초기화 (안전장치)
  useEffect(() => {
    if (isLoaded && !ready) {
      init();
    }
  }, [isLoaded, ready, init]);

  const handleSelect = (description: string) => {
    setValue(description, false);
    clearSuggestions();
    onSelect(description);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ready && inputRef.current) {
      inputRef.current.focus();
    }
  }, [ready]);

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('', false);
    clearSuggestions();
    onSelect('');
    inputRef.current?.focus();
  };

  return {
    value,
    setValue,
    suggestions: data,
    status,
    ready,
    recentLocations,
    handleSelect,
    clearSuggestions,
    inputRef,
    clearInput,
  };
};

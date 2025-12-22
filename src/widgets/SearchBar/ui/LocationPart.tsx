import { useEffect, useRef, useState } from 'react';
import { BiMap, BiTime } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';
import usePlacesAutocomplete from 'use-places-autocomplete';

import { DropdownItem } from './DropdownItem';
import { DropdownWrapper } from './DropdownWrapper';

type Props = {
  isLoaded: boolean;
  onSelect: (address: string) => void;
};

export const LocationPart = ({ isLoaded, onSelect }: Props) => {
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

  const inputRef = useRef<HTMLInputElement>(null);

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

  const renderDropdownContent = () => {
    // A. 입력값이 없을 때 (초기 상태)
    if (value === '') {
      // A-1. 최근 검색 기록이 없을 경우
      if (recentLocations.length === 0) {
        return (
          <div className="py-6 text-center text-gray-400 text-sm">최근 검색한 지역이 없습니다.</div>
        );
      }

      // A-2. 최근 검색 기록이 있을 경우
      return (
        <>
          {recentLocations.map((loc, index) => (
            <DropdownItem
              // key는 유니크해야 하므로 index와 조합
              key={`${loc}-${index}`}
              title={loc}
              description="최근 검색" // 부가 설명
              icon={<BiTime className="text-gray-400" />} // 시계 아이콘 사용
              onClick={() => handleSelect(loc)}
            />
          ))}
        </>
      );
    }

    // B. 입력값이 있고 구글 검색 결과가 있을 때
    if (status === 'OK') {
      return data.map(({ place_id, structured_formatting }) => (
        <DropdownItem
          key={place_id}
          title={structured_formatting.main_text}
          description={structured_formatting.secondary_text}
          icon={<BiMap />}
          onClick={() => handleSelect(structured_formatting.main_text)}
        />
      ));
    }

    // C. 검색 중이거나 결과가 없을 때
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        {status === 'ZERO_RESULTS' ? '검색 결과가 없습니다.' : '장소를 찾는 중...'}
      </div>
    );
  };

  return (
    <>
      {/* 입력창 */}
      <div className="relative w-full flex items-center">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder={ready ? '위치 검색' : '위치 서비스 로딩 중...'}
          className="w-full text-[16px] text-gray-900 outline-none bg-transparent placeholder-gray-400 pr-8"
        />

        {value && (
          <button
            onClick={clearInput}
            className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdCloseCircle size={20} />
          </button>
        )}
      </div>

      {/* 드롭다운: ready 상태라면(스크립트 로드 완료) 무조건 렌더링.
         내용물만 위 renderDropdownContent()로 분기 처리
      */}
      {ready && (
        <DropdownWrapper title={value ? '검색 결과' : '최근 검색 지역'}>
          {renderDropdownContent()}
        </DropdownWrapper>
      )}
    </>
  );
};

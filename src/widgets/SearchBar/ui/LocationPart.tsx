import { useEffect } from 'react';
import { BiCurrentLocation, BiMap } from 'react-icons/bi';
import usePlacesAutocomplete from 'use-places-autocomplete';

import { DropdownItem } from './DropdownItem';
import { DropdownWrapper } from './DropdownWrapper';

type Props = {
  isLoaded: boolean;
  onSelect: (address: string) => void;
};

const POPULAR_LOCATIONS = [
  { id: 'p1', main: 'Warsaw', sub: 'Poland' },
  { id: 'p2', main: 'Ulm', sub: 'Germany' },
  { id: 'p3', main: 'Berlin', sub: 'Germany' },
];

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

  // 2. 드롭다운에 무엇을 보여줄지 결정하는 로직
  const renderDropdownContent = () => {
    if (value === '') {
      return (
        <>
          {POPULAR_LOCATIONS.map((loc) => (
            <DropdownItem
              key={loc.id}
              title={loc.main}
              description={loc.sub}
              icon={<BiCurrentLocation className="text-gray-400" />} // 아이콘 예시
              onClick={() => handleSelect(loc.main)}
            />
          ))}
        </>
      );
    }

    // B. 입력값이 있고 검색 결과가 성공적일 때 -> 'Google 검색 결과'
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
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready} // 스크립트 로드 전에는 입력 방지
        placeholder={ready ? '지역 검색' : '구글 맵 준비중...'}
        className="w-full text-[16px] text-gray-900 outline-none bg-transparent placeholder-gray-400"
      />

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

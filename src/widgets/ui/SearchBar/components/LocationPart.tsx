import { BiMap, BiTime } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';

import { useLocationSearch } from '../../../hooks';
import { DropdownItem } from './DropdownItem';
import { DropdownWrapper } from './DropdownWrapper';

type Props = {
  isLoaded: boolean;
  onSelect: (address: string) => void;
};

export const LocationPart = ({ isLoaded, onSelect }: Props) => {
  const {
    value,
    setValue,
    suggestions: data,
    status,
    ready,
    recentLocations,
    handleSelect,
    inputRef,
    clearInput,
  } = useLocationSearch(isLoaded, onSelect);

  const renderDropdownContent = () => {
    if (value === '') {
      if (recentLocations.length === 0) {
        return (
          <div className="py-6 text-center text-gray-400 text-sm">최근 검색한 지역이 없습니다.</div>
        );
      }

      return (
        <>
          {recentLocations.map((loc, index) => (
            <DropdownItem
              key={`${loc}-${index}`}
              title={loc}
              description="최근 검색"
              icon={<BiTime className="text-gray-400" />}
              onClick={() => handleSelect(loc)}
            />
          ))}
        </>
      );
    }

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

      {ready && (
        <DropdownWrapper title={value ? '검색 결과' : '최근 검색 지역'}>
          {renderDropdownContent()}
        </DropdownWrapper>
      )}
    </>
  );
};

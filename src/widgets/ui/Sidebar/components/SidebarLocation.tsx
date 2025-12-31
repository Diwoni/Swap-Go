import { useEffect, useState } from 'react';
import { BiMap, BiSearch, BiTime, BiX } from 'react-icons/bi';

import { useLocationSearch } from '../../../hooks/useLocationSearch';

type Props = {
  isLoaded: boolean;
  selectedLocation: string | undefined;
  onLocationChange: (region: string | undefined) => void;
};

export const SidebarLocation = ({ isLoaded, selectedLocation, onLocationChange }: Props) => {
  const {
    value,
    setValue,
    suggestions,
    status,
    ready,
    recentLocations,
    handleSelect,
    inputRef,
    clearInput,
  } = useLocationSearch(isLoaded, (address) => onLocationChange(address));

  const [isFocused, setIsFocused] = useState(false);

  // url 에 region 이 있다면 setValue 로 input에 설정
  useEffect(() => {
    setValue(selectedLocation ?? '', false);
  }, [selectedLocation, setValue]);

  // 드롭다운 내에서 주소 클릭 시 실행
  const handleClickItem = (address: string) => {
    handleSelect(address); // value 설정 + clearSuggestion + 부모 상태 업데이트도 같이
    setIsFocused(false); // 드롭다운 닫기
  };

  const showDropdown = isFocused && ready;

  return (
    <div className="relative w-full">
      {/* 입력창 */}
      <div
        className={`flex items-center border rounded-lg px-3 h-[45px] bg-white transition-all
        ${isFocused ? 'border-[#88B04B] ring-1 ring-[#88B04B]' : 'border-gray-200'}`}
      >
        <BiSearch className="text-gray-400 mr-2 shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value) onLocationChange(undefined); // 지우면 상태도 초기화
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // onBlur 시 환경에 따라 click 이벤트 전에 드롭다운 닫을 수도 있음. (지연 처리)
          disabled={!ready}
          placeholder={ready ? '지역 선택' : '로딩 중...'}
          className="w-full text-sm outline-none placeholder:text-gray-400 bg-transparent"
        />
        {value && (
          <button onClick={clearInput} className="text-gray-400 hover:text-gray-600 p-1">
            <BiX size={18} />
          </button>
        )}
      </div>

      {/* 드롭다운 결과 리스트 */}
      {showDropdown && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-[240px] overflow-y-auto custom-scrollbar">
          {/* A. 입력값 없을 때: 최근 검색어 */}
          {!value &&
            (recentLocations.length > 0 ? (
              recentLocations.map((loc, idx) => (
                <li
                  key={`recent-${idx}`}
                  onClick={() => handleClickItem(loc)}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-50 last:border-none"
                >
                  <BiTime className="text-gray-400 shrink-0" />
                  <span className="truncate">{loc}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-xs text-gray-400 text-center">
                최근 검색 기록이 없습니다.
              </li>
            ))}

          {/* B. 검색 결과 (Google) */}
          {value &&
            status === 'OK' &&
            suggestions.map(({ place_id, structured_formatting }) => (
              <li
                key={place_id}
                onClick={() => handleClickItem(structured_formatting.main_text)}
                className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-start gap-2 border-b border-gray-50 last:border-none"
              >
                <BiMap className="text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">{structured_formatting.main_text}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {structured_formatting.secondary_text}
                  </span>
                </div>
              </li>
            ))}

          {/* C. 결과 없음 */}
          {value && status === 'ZERO_RESULTS' && (
            <li className="px-4 py-6 text-xs text-gray-400 text-center">검색 결과가 없습니다.</li>
          )}
        </ul>
      )}
    </div>
  );
};

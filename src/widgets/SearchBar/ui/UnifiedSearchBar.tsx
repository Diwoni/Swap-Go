import { useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

import { saveSearchHistoryToLocalStorage } from '../../../shared/utils/saveSearchHistoryToLocalStorage';
import { CategoryPart } from './CategoryPart';
import { KeywordPart } from './KeywordPart';
import { LocationPart } from './LocationPart';
import { SearchSection } from './SearchSection';

const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = ['places'];

type ActiveSection = 'LOCATION' | 'CATEGORY' | 'KEYWORD' | null;

export const UnifiedSearchBar = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
    language: 'en',
  });
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  // TODO : 넘겨줘야할 데이터들
  const [searchData, setSearchData] = useState({
    location: '',
    category: '',
    keyword: '',
  });

  // 외부 클릭 시 드롭다운 메뉴 비활성화
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // TODO : 검색 시 로컬 스토리지에 위치, 키워드 저장 (for 최근 검색어)
  const handleSearch = () => {
    const { location, keyword } = searchData;
    saveSearchHistoryToLocalStorage('recent_locations', location);
    saveSearchHistoryToLocalStorage('recent_keywords', keyword);
    setActiveSection(null);
    // TODO : 페이지 이동 (검색 필터 적용된 이동)
  };

  return (
    <div className="w-full max-w-[800px] mx-auto relative pt-10" ref={containerRef}>
      {/* 메인 컨테이너 */}
      <div
        className={`flex items-center bg-white border border-black-200 rounded-3xl h-[66px] shadow-sm transition-all
          ${activeSection ? 'bg-[#EBEBEB]' : 'hover:shadow-md'}
      `}
      >
        {/* 위치 섹션 */}
        <SearchSection
          label="위치"
          value={searchData.location}
          placeholder="위치 검색"
          isActive={activeSection === 'LOCATION'}
          onActivate={() => setActiveSection('LOCATION')}
          renderInput={
            isLoaded ? (
              <LocationPart
                isLoaded={isLoaded}
                onSelect={(val) => {
                  setSearchData({ ...searchData, location: val });
                  setActiveSection('CATEGORY'); // 선택하면 자동으로 다음 섹션 이동
                }}
              />
            ) : (
              <div className="text-sm text-gray-400 pl-1">위치 서비스 불러오는 중...</div>
            )
          }
        />

        <div className="h-8 w-[1px] bg-black-200" />

        {/* 2. 카테고리 섹션 */}
        <SearchSection
          label="카테고리"
          value={searchData.category}
          placeholder="카테고리 설정"
          isActive={activeSection === 'CATEGORY'}
          onActivate={() => setActiveSection('CATEGORY')}
          onClear={() => setSearchData({ ...searchData, category: '' })}
        >
          {/* 카테고리는 Input이 없으므로 children으로 드롭다운만 전달 */}
          <CategoryPart
            onSelect={(cat) => {
              setSearchData({ ...searchData, category: cat });
              setActiveSection('KEYWORD'); // 선택하면 자동으로 다음 섹션 이동
            }}
          />
        </SearchSection>

        <div className="h-8 w-[1px] bg-black-200" />

        {/* 3. 검색어 섹션 */}
        <SearchSection
          label="검색"
          value={searchData.keyword}
          placeholder="물품 직접 검색"
          isActive={activeSection === 'KEYWORD'}
          onActivate={() => setActiveSection('KEYWORD')}
          renderInput={
            <KeywordPart
              value={searchData.keyword}
              onChange={(val) => {
                setSearchData({ ...searchData, keyword: val });
              }}
              onSearch={handleSearch}
            />
          }
        />

        {/* 검색 버튼 */}
        <div className="pr-2 pl-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
            className="w-[40px] h-[40px] bg-[#A1BC98] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#778873] transition-colors shadow-md"
          >
            <BiSearch width={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

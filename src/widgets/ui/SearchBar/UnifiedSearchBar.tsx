import { BiSearch } from 'react-icons/bi';

import { useSearchbar } from '../../hooks';
import { CategoryPart } from './components/CategoryPart';
import { KeywordPart } from './components/KeywordPart';
import { LocationPart } from './components/LocationPart';
import { SearchSection } from './components/SearchSection';
import { TradeTypeSelector } from './components/TradeTypeSelector';

export const UnifiedSearchBar = () => {
  const { refs, state, actions } = useSearchbar();
  const { isLoaded, activeSection, tradeType, searchData } = state;

  return (
    <div className="w-full max-w-[900px] mx-auto relative mb-5" ref={refs.containerRef}>
      <div className="flex items-center">
        {/* 거래 유형 선택 */}
        <TradeTypeSelector selected={tradeType} onChange={actions.setTradeType} />

        {/* 검색바 컨테이너 */}
        <div
          className={`flex-1 flex items-center bg-white border border-black-200 rounded-3xl h-[66px] shadow-sm transition-all
            ${activeSection ? 'bg-[#EBEBEB]' : 'hover:shadow-md'}
        `}
        >
          {/* 위치 선택 */}
          <SearchSection
            label="위치"
            value={searchData.location}
            placeholder="위치 검색"
            isActive={activeSection === 'LOCATION'}
            onActivate={() => actions.setActiveSection('LOCATION')}
            renderInput={
              isLoaded ? (
                <LocationPart
                  isLoaded={isLoaded}
                  onSelect={(val) => {
                    actions.updateSearchData('location', val);
                    actions.setActiveSection('CATEGORY');
                  }}
                />
              ) : (
                <div className="text-sm text-gray-400 pl-1">로딩 중...</div>
              )
            }
          />

          <SearchDivider />

          {/* 카테고리 선택 */}
          <SearchSection
            label="카테고리"
            value={searchData.category}
            placeholder="카테고리 설정"
            isActive={activeSection === 'CATEGORY'}
            onActivate={() => actions.setActiveSection('CATEGORY')}
            onClear={() => actions.updateSearchData('category', '')}
          >
            <CategoryPart
              onSelect={(cat) => {
                actions.updateSearchData('category', cat);
                actions.setActiveSection('KEYWORD');
              }}
            />
          </SearchSection>

          <SearchDivider />

          {/* 키워드 검색 */}
          <SearchSection
            label="검색"
            value={searchData.keyword}
            placeholder="물품 직접 검색"
            isActive={activeSection === 'KEYWORD'}
            onActivate={() => actions.setActiveSection('KEYWORD')}
            renderInput={
              <KeywordPart
                value={searchData.keyword}
                onChange={(val) => actions.updateSearchData('keyword', val)}
                onSearch={actions.handleSearch}
              />
            }
          />

          {/* 검색 버튼 */}
          <SearchButton onClick={actions.handleSearch} />
        </div>
      </div>
    </div>
  );
};

const SearchDivider = () => <div className="h-8 w-[1px] bg-black-200" />;

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => (
  <div className="pr-2 pl-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-[40px] h-[40px] bg-[#A1BC98] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#778873] transition-colors shadow-md"
    >
      <BiSearch width={24} />
    </button>
  </div>
);

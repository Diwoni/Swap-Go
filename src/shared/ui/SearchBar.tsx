import { IoIosArrowDown } from 'react-icons/io';

import { useSearchBar } from '../hooks/useSearchBar';
import { LocationBar } from './LocationBar';

type onSearchProps = {
  category: string;
  query: string;
};

type SearchBarProps = {
  placeholder?: string;
  categories?: string[];
  onSearch: ({ category, query }: onSearchProps) => void;
};

export const SearchBar = ({
  placeholder = '검색할 물품을 입력하세요.',
  categories = ['중고거래', '단기렌탈'],
  onSearch,
}: SearchBarProps) => {
  const {
    isDropdownOpen,
    selectedCategory,
    searchValue,
    toggleDropdown,
    selectCategory,
    updateSearchValue,
    doSearch,
  } = useSearchBar({ categories, onSearch });

  return (
    <div className="flex">
      <LocationBar />
      <div className="flex h-[60px] border-2 border-primary-50 rounded-xl ml-2">
        {/* 카테고리 드롭다운 버튼 */}
        <div className="w-[150px] relative z-50 flex overflow-visible">
          <button
            onClick={toggleDropdown}
            className="w-[150px] h-[60px] flex justify-center items-center text-lg"
          >
            <span className="mr-4">{selectedCategory}</span>
            <IoIosArrowDown className="w-6 h-6" />
          </button>
          <div className="bg-primary-50 w-0.5"></div>
          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-[60px] w-[160px] bg-white border-2 rounded-md border-primary-50 hover:bg-gray-50 transition-colors overflow-hidden">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => selectCategory(category)}
                  className={`w-full px-6 py-3 text-left hover:bg-indigo-50 transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* 검색 입력 필드 */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => updateSearchValue(e.target.value)}
          placeholder={placeholder}
          className="px-6 w-[600px] text-lg outline-none rounded-xl"
        />
      </div>
      {/* 검색 버튼 */}
      <button onClick={doSearch} className="ml-2 btn btn-primary btn-sm">
        검색
      </button>
    </div>
  );
};

import { useJsApiLoader } from '@react-google-maps/api';

import { useFilterSidebar } from '../../hooks';
import { SidebarAvailable } from './components/SidebarAvailable'; // ✨ 추가
// 부품들 import
import { SidebarCategory } from './components/SidebarCategory';
import { SidebarDealType } from './components/SidebarDealType'; // ✨ 추가
import { SidebarLocation } from './components/SidebarLocation';
import { SidebarPrice } from './components/SidebarPrice';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = ['places'];

export const FilterSidebar = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  const { state, actions } = useFilterSidebar();

  return (
    <aside className="w-[320px] flex flex-col gap-6 bg-white p-2 pb-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between pt-2 border-b border-gray-100 pb-4">
        <h2 className="text-[17px] font-bold text-black-200">필터</h2>
        <button
          onClick={actions.handleReset}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          초기화
        </button>
      </div>

      {/* 1. 지역 선택 */}
      <section>
        <h3 className="text-[15px] font-bold text-gray-800 mb-3">지역</h3>
        <SidebarLocation
          isLoaded={isLoaded}
          selectedLocation={state.region}
          onLocationChange={actions.setRegion}
        />
      </section>

      {/* 2. 거래 가능 여부 (✨ 컴포넌트 교체) */}
      <section>
        <SidebarAvailable checked={state.isAvailable} onChange={actions.handleIsAvailableChange} />
      </section>

      {/* 3. 거래 유형 (✨ 컴포넌트 교체) */}
      <section>
        <SidebarDealType value={state.dealType} onChange={actions.handleDealTypeChange} />
      </section>

      {/* 4. 카테고리 */}
      <section>
        <h3 className="text-[15px] font-bold text-gray-800 mb-3">카테고리</h3>
        <SidebarCategory selected={state.categories} onChange={actions.handleCategoryChange} />
      </section>

      {/* 5. 가격 */}
      <section>
        <h3 className="text-[15px] font-bold text-gray-800 mb-3">가격</h3>
        <SidebarPrice
          min={state.minPrice}
          max={state.maxPrice}
          onChange={actions.handlePriceChange}
        />
      </section>

      {/* 검색 버튼 */}
      <div className="pt-2">
        <button
          onClick={actions.applyFilters}
          className="w-full h-[50px] bg-primary-150 text-white font-bold rounded-xl hover:bg-primary-200 active:scale-[0.98] transition-all shadow-sm"
        >
          현재 설정으로 검색
        </button>
      </div>
    </aside>
  );
};

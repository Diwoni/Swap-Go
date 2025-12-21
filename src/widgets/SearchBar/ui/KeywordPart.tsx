import { useState } from 'react';
import { BiTime } from 'react-icons/bi';

import { DropdownItem } from '../ui/DropdownItem';
import { DropdownWrapper } from '../ui/DropdownWrapper';

// TODO : 실제로는 로컬 스토리지에서 가져와야 함.
const MOCK_RECENT_SEARCHES = ['맥북 프로', '아이폰 15', '캠핑 의자'];

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
};

export const KeywordPart = ({ value, onChange, onSearch }: Props) => {
  const [recentSearches] = useState<string[]>(MOCK_RECENT_SEARCHES);

  return (
    <>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="물품명 검색"
        className="w-full text-[16px] text-gray-900 outline-none bg-transparent placeholder-gray-400"
      />

      <DropdownWrapper title="최근 검색어">
        {recentSearches.length > 0 ? (
          recentSearches.map((item) => (
            <DropdownItem
              key={item}
              title={item}
              icon={<BiTime className="text-gray-400" />}
              onClick={() => {
                onChange(item);
              }}
            />
          ))
        ) : (
          <div className="py-4 text-center text-gray-400 text-sm">최근 검색 내역이 없습니다.</div>
        )}
      </DropdownWrapper>
    </>
  );
};

import { useEffect, useState } from 'react';
import { BiTime } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';

import { DropdownItem } from './DropdownItem';
import { DropdownWrapper } from './DropdownWrapper';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
};

export const KeywordPart = ({ value, onChange, onSearch }: Props) => {
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent_keywords');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentKeywords(parsed);
        }
      } catch (error) {
        console.error('최근 검색어를 불러오는 도중 오류가 발생했습니다. :', error);
      }
    }
  }, []);

  return (
    <>
      {/* 2. Input을 감싸는 div 추가 (relative positioning) */}
      <div className="relative w-full flex items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="물품 직접 검색"
          className="w-full text-[16px] text-gray-900 outline-none bg-transparent placeholder-gray-400 pr-8"
        />

        {/* 4. 값이 있을 때만 X 버튼 표시 */}
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <IoMdCloseCircle size={20} />
          </button>
        )}
      </div>

      <DropdownWrapper title="최근 검색어">
        {recentKeywords.length > 0 ? (
          recentKeywords.map((item) => (
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

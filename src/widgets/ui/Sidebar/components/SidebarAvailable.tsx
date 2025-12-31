type SidebarAvailableProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const SidebarAvailable = ({ checked, onChange }: SidebarAvailableProps) => {
  // 메인 컬러 (SidebarCategory와 동일)
  const primaryColorClass = 'bg-[#88B04B] border-[#88B04B]';
  const baseBorderClass = 'bg-white border-gray-300 group-hover:border-[#88B04B]';

  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      {/* 1. 커스텀 체크박스 디자인 (div) */}
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
        ${checked ? primaryColorClass : baseBorderClass}`}
      >
        {/* 체크되었을 때만 보이는 체크 아이콘 (SVG) */}
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* 2. 실제 동작을 담당하는 숨겨진 input */}
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {/* 3. 라벨 텍스트 */}
      <span
        className={`text-[15px] transition-colors ${
          checked ? 'text-gray-900 font-medium' : 'text-gray-700 group-hover:text-gray-900'
        }`}
      >
        거래 가능 상품만 보기
      </span>
    </label>
  );
};

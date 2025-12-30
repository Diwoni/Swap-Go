type SidebarDealTypeProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const SidebarDealType = ({ value, onChange }: SidebarDealTypeProps) => {
  // 내부에서만 쓰는 스타일 헬퍼 함수
  const getButtonStyle = (targetValue: string | undefined) => {
    const isSelected = value === targetValue;
    return `flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
      isSelected
        ? 'bg-primary-100 border-primary-100 text-primary-600 font-bold'
        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
    }`;
  };

  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-800 mb-3">거래 유형</h3>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={getButtonStyle(undefined)}
        >
          전체
        </button>
        <button type="button" onClick={() => onChange('SELL')} className={getButtonStyle('SELL')}>
          팝니다
        </button>
        <button type="button" onClick={() => onChange('BUY')} className={getButtonStyle('BUY')}>
          삽니다
        </button>
      </div>
    </div>
  );
};

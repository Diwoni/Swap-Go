export type TradeType = 'resale' | 'rental';

interface TradeTypeSelectorProps {
  selected: TradeType;
  onChange: (type: TradeType) => void;
}

export const TradeTypeSelector = ({ selected, onChange }: TradeTypeSelectorProps) => {
  return (
    <div className="flex flex-col justify-center gap-2 mr-4 shrink-0">
      {/* 중고거래 버튼 */}
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative flex items-center justify-center w-4 h-4">
          <input
            type="radio"
            name="tradeType"
            value="resale"
            checked={selected === 'resale'}
            onChange={() => onChange('resale')}
            className="peer appearance-none w-4 h-4 border border-gray-400 rounded-full checked:border-primary-200 checked:border-[4px] transition-all"
          />
        </div>
        <span
          className={`text-sm ${
            selected === 'resale'
              ? 'font-bold text-black-200'
              : 'text-gray-500 group-hover:text-black-200'
          }`}
        >
          중고거래
        </span>
      </label>

      {/* 단기렌탈 버튼 */}
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative flex items-center justify-center w-4 h-4">
          <input
            type="radio"
            name="tradeType"
            value="rental"
            checked={selected === 'rental'}
            onChange={() => onChange('rental')}
            className="peer appearance-none w-4 h-4 border border-gray-400 rounded-full checked:border-primary-200 checked:border-[4px] transition-all"
          />
        </div>
        <span
          className={`text-sm ${
            selected === 'rental'
              ? 'font-bold text-black-200'
              : 'text-gray-500 group-hover:text-black-200'
          }`}
        >
          단기렌탈
        </span>
      </label>
    </div>
  );
};

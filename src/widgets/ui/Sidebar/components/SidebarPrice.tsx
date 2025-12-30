interface Props {
  min: string;
  max: string;
  onChange: (min: string, max: string) => void;
}

export const SidebarPrice = ({ min, max, onChange }: Props) => {
  const handleInput = (type: 'min' | 'max', val: string) => {
    const num = val.replace(/[^0-9]/g, '');
    if (type === 'min') onChange(num, max);
    else onChange(min, num);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={min ? Number(min).toLocaleString() : ''}
        onChange={(e) => handleInput('min', e.target.value)}
        placeholder="최소"
        className="w-full h-[40px] px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#88B04B] text-right placeholder:text-left"
      />
      <span className="text-gray-400">~</span>
      <input
        value={max ? Number(max).toLocaleString() : ''}
        onChange={(e) => handleInput('max', e.target.value)}
        placeholder="최대"
        className="w-full h-[40px] px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#88B04B] text-right placeholder:text-left"
      />
    </div>
  );
};

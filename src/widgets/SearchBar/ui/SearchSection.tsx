type SearchSectionProps = {
  label: string;
  value: string | null;
  placeholder: string;
  isActive: boolean;
  onActivate: () => void;
  renderInput?: () => React.ReactNode;
  children?: React.ReactNode;
};

export const SearchSection = ({
  label,
  value,
  placeholder,
  isActive,
  onActivate,
  renderInput,
  children,
}: SearchSectionProps) => {
  return (
    <div
      className={`relative flex flex-col w-[250px] h-[60px] px-[20px] cursor-pointer rounded-[25px] transition-all border-none
        ${isActive ? 'bg-[#F1F3E0]' : 'bg-white hover:bg-[#F1F3E0]'}`}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
    >
      <span className="text-sm pt-[10px]">{label}</span>

      {isActive && renderInput ? (
        <div className="w-full">{renderInput()}</div>
      ) : (
        /* 비활성 상태거나 Input이 없으면 텍스트만 보여줌 */
        <span
          className={`text-[16px] truncate ${value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
        >
          {value ?? placeholder}
        </span>
      )}

      {/* 활성화 상태일 때 드롭다운(children) 노출 */}
      {isActive && children}
    </div>
  );
};

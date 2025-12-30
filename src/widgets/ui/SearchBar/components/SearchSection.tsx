import { IoMdCloseCircle } from 'react-icons/io';

type SearchSectionProps = {
  label: string;
  value: string | null;
  placeholder: string;
  isActive: boolean;
  onActivate: () => void;
  renderInput?: React.ReactNode;
  children?: React.ReactNode;
  onClear?: () => void;
};

export const SearchSection = ({
  label,
  value,
  placeholder,
  isActive,
  onActivate,
  renderInput,
  children,
  onClear,
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
      <span className="text-sm font-bold pt-[10px]">{label}</span>

      {isActive && renderInput ? (
        <div className="w-full">{renderInput}</div>
      ) : (
        <div className="flex items-center justify-between w-full h-[24px]">
          <span
            className={`text-[16px] truncate pr-2 ${value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
          >
            {value?.length ? value : placeholder}
          </span>

          {isActive && value && onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <IoMdCloseCircle size={20} />
            </button>
          )}
        </div>
      )}

      {/* 활성화 상태일 때 드롭다운(children) 노출 */}
      {isActive && children}
    </div>
  );
};

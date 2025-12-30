import { CATEGORY_LIST } from '../../../../shared/libs/constants';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const SidebarCategory = ({ selected, onChange }: Props) => {
  const toggleCategory = (cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  const isAllSelected = selected.length === 0;

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
          ${isAllSelected ? 'bg-[#88B04B] border-[#88B04B]' : 'bg-white border-gray-300 group-hover:border-[#88B04B]'}`}
        >
          {isAllSelected && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          className="hidden"
          checked={isAllSelected}
          onChange={() => onChange([])}
        />
        <span
          className={`text-sm ${isAllSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
        >
          전체 보기
        </span>
      </label>

      {CATEGORY_LIST.map((cat) => {
        const isChecked = selected.includes(cat.name);
        return (
          <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
              ${isChecked ? 'bg-[#88B04B] border-[#88B04B]' : 'bg-white border-gray-300 group-hover:border-[#88B04B]'}`}
            >
              {isChecked && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={isChecked}
              onChange={() => toggleCategory(cat.name)}
            />
            <span
              className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
            >
              {cat.name}
            </span>
          </label>
        );
      })}
    </div>
  );
};

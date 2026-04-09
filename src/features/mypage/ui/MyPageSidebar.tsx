import { MyPageSidebarOption } from '../hooks/useMyPage';

interface Props {
  activeSidebarOption: MyPageSidebarOption | null;
  onSelectOption: (option: MyPageSidebarOption) => void;
}

const SIDEBAR_MENU: { label: string; value: MyPageSidebarOption }[] = [
  { label: '거래요청', value: 'tradeOffer' },
  { label: '거래내역', value: 'transaction' },
];

export const MyPageSidebar = ({ activeSidebarOption, onSelectOption }: Props) => {
  return (
    <nav className="w-32 shrink-0">
      <ul className="flex flex-col gap-1">
        {SIDEBAR_MENU.map(({ label, value }) => (
          <li key={value}>
            <button
              onClick={() => onSelectOption(value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSidebarOption === value
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

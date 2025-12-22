import { DropdownItem } from '../ui/DropdownItem';
import { DropdownWrapper } from '../ui/DropdownWrapper';

const CATEGORIES = [
  { name: '가전 · 디지털', desc: '휴대폰, 태블릿, PC', icon: '💻' },
  { name: '가구 · 생활', desc: '가구, 인테리어, 주방', icon: '🪑' },
  { name: '패션 · 뷰티', desc: '의류, 화장품', icon: '👗' },
  { name: '취미 · 기타', desc: '게임, 캠핑, 운동', icon: '⛺' },
];

type Props = {
  onSelect: (category: string) => void;
};

export const CategoryPart = ({ onSelect }: Props) => {
  return (
    <DropdownWrapper title="카테고리">
      {CATEGORIES.map((cat) => (
        <DropdownItem
          key={cat.name}
          title={cat.name}
          description={cat.desc}
          icon={<span>{cat.icon}</span>}
          onClick={() => onSelect(cat.name)}
        />
      ))}
    </DropdownWrapper>
  );
};

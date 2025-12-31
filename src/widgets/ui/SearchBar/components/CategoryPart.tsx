import { CATEGORY_LIST } from '../../../../shared/libs/constants';
import { DropdownItem } from './DropdownItem';
import { DropdownWrapper } from './DropdownWrapper';

type Props = {
  onSelect: (category: string) => void;
};

export const CategoryPart = ({ onSelect }: Props) => {
  return (
    <DropdownWrapper title="카테고리">
      {CATEGORY_LIST.map((cat) => (
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

import 'react-day-picker/dist/style.css';

import { ko } from 'date-fns/locale';
import { DateRange, DayPicker } from 'react-day-picker';

type Props = {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  disabledDays?: { before: Date };
  className?: string;
};

export const DateRangeCalendar = ({ selected, onSelect, disabledDays, className }: Props) => {
  return (
    <div className={`border border-gray-200 rounded-xl p-2 bg-white shadow-sm ${className}`}>
      <style>{`
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: #A1BC98;
          color: white;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #f3f4f6;
        }
      `}</style>

      <DayPicker
        mode="range"
        defaultMonth={new Date()}
        selected={selected}
        onSelect={onSelect}
        locale={ko}
        disabled={disabledDays ?? { before: new Date() }}
        numberOfMonths={1}
      />
    </div>
  );
};

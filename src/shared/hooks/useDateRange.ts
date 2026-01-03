import { differenceInDays, format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const reset = () => setDateRange(undefined);

  const startDate = dateRange?.from;
  const endDate = dateRange?.to;

  // "YYYY-MM-DD" 포맷
  const formattedStart = startDate ? format(startDate, 'yyyy-MM-dd') : null;
  const formattedEnd = endDate ? format(endDate, 'yyyy-MM-dd') : null;

  // "YYYY.MM.DD" 포맷
  const displayStart = startDate ? format(startDate, 'yyyy.MM.dd') : '시작일';
  const displayEnd = endDate ? format(endDate, 'yyyy.MM.dd') : '종료일';

  // 기간 계산 (박수)
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const days = nights + 1;
  const durationLabel = nights > 0 ? `${nights}박 ${days}일` : '-';

  const isValid = !!(formattedStart && formattedEnd);

  return {
    dateRange,
    setDateRange,
    reset,
    formatted: { start: formattedStart, end: formattedEnd },
    display: { start: displayStart, end: displayEnd, duration: durationLabel },
    isValid,
  };
};

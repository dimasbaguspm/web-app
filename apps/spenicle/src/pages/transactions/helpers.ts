import dayjs, { Dayjs } from 'dayjs';

export const getDateRange = (
  currentDate: Dayjs,
  range: 'month' | 'week' | 'twoWeeks',
): Dayjs[] => {
  const ranges: Dayjs[] = [];

  let startDate: Dayjs = dayjs();
  let endDate: Dayjs = dayjs();

  if (range === 'month') {
    startDate = currentDate.startOf('month');
    endDate = currentDate.endOf('month');
  } else if (range === 'twoWeeks') {
    startDate = currentDate.startOf('week');
    endDate = currentDate.add(2, 'weeks').endOf('week');
  } else if (range === 'week') {
    startDate = currentDate.startOf('week');
    endDate = currentDate.endOf('week');
  }

  while (startDate.isBefore(endDate)) {
    ranges.push(startDate);
    startDate = startDate.add(1, 'day');
  }

  return ranges;
};

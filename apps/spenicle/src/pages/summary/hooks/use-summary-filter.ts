import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export type SummaryFrequencyType =
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'allTheTime';

export type SummaryFilterModel = {
  range: {
    startDate: Dayjs;
    endDate: Dayjs;
  };
  categoryIds?: number[];
  accountIds?: number[];
};

// Helper function to convert frequency to date range
const frequencyToDateRange = (frequency: SummaryFrequencyType) => {
  let dateStart = dayjs().startOf('week');
  let dateEnd = dayjs().endOf('week');

  switch (frequency) {
    case 'thisWeek':
      dateStart = dayjs().startOf('week');
      dateEnd = dayjs().endOf('week');
      break;
    case 'lastWeek':
      dateStart = dayjs().subtract(1, 'week').startOf('week');
      dateEnd = dayjs().subtract(1, 'week').endOf('week');
      break;
    case 'thisMonth':
      dateStart = dayjs().startOf('month');
      dateEnd = dayjs().endOf('month');
      break;
    case 'lastMonth':
      dateStart = dayjs().subtract(1, 'month').startOf('month');
      dateEnd = dayjs().subtract(1, 'month').endOf('month');
      break;
    case 'thisYear':
      dateStart = dayjs().startOf('year');
      dateEnd = dayjs().endOf('year');
      break;
    case 'allTheTime':
      dateStart = dayjs('1970-01-01');
      dateEnd = dayjs();
  }

  return { startDate: dateStart, endDate: dateEnd };
};

// Helper function to convert humanized label to frequency
const humanizedLabelToFrequency = (
  label: string,
): SummaryFrequencyType | null => {
  const labelMap: Record<string, SummaryFrequencyType> = {
    'This Week': 'thisWeek',
    'Last Week': 'lastWeek',
    'This Month': 'thisMonth',
    'Last Month': 'lastMonth',
    'This Year': 'thisYear',
  };

  return labelMap[label] || null;
};

// Helper function to get humanized label from date range
const getHumanizedLabel = (startDate: Dayjs, endDate: Dayjs): string => {
  const today = dayjs();

  if (
    startDate.isSame(today.startOf('week'), 'day') &&
    endDate.isSame(today.endOf('week'), 'day')
  ) {
    return 'This Week';
  } else if (
    startDate.isSame(today.subtract(1, 'week').startOf('week'), 'day') &&
    endDate.isSame(today.subtract(1, 'week').endOf('week'), 'day')
  ) {
    return 'Last Week';
  } else if (
    startDate.isSame(today.startOf('month'), 'day') &&
    endDate.isSame(today.endOf('month'), 'day')
  ) {
    return 'This Month';
  } else if (
    startDate.isSame(today.subtract(1, 'month').startOf('month'), 'day') &&
    endDate.isSame(today.subtract(1, 'month').endOf('month'), 'day')
  ) {
    return 'Last Month';
  } else if (
    startDate.isSame(today.startOf('year'), 'day') &&
    endDate.isSame(today.endOf('year'), 'day')
  ) {
    return 'This Year';
  } else if (
    startDate.isSame(dayjs('1970-01-01'), 'day') &&
    endDate.isSame(today, 'day')
  ) {
    return 'All Time';
  }

  return 'Custom Range';
};

export const useSummaryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [plainDateStart, plainDateEnd, plainCategoryIds, plainAccountIds] = [
    searchParams.get('dateStart'),
    searchParams.get('dateEnd'),
    searchParams.getAll('categoryIds').map(Number),
    searchParams.getAll('accountIds').map(Number),
  ];

  useEffect(() => {
    if (plainDateStart === null && plainDateEnd === null) {
      setFilters({
        range: {
          startDate: dayjs().startOf('week'),
          endDate: dayjs().endOf('week'),
        },
        categoryIds: plainCategoryIds,
        accountIds: plainAccountIds,
      });
    }
  }, [plainDateStart, plainDateEnd]);

  const [dateStart, dateEnd, categoryIds, accountIds] = [
    plainDateStart ? dayjs(plainDateStart) : dayjs().startOf('week'),
    plainDateEnd ? dayjs(plainDateEnd) : dayjs().endOf('week'),
    searchParams.getAll('categoryIds').map(Number),
    searchParams.getAll('accountIds').map(Number),
  ];

  const appliedFilters: SummaryFilterModel = {
    range: {
      startDate: dateStart,
      endDate: dateEnd,
    },
    categoryIds,
    accountIds,
  };

  const humanizedFilters = (() => {
    const list: {
      key: keyof SummaryFilterModel;
      label: string;
    }[] = [];

    if (appliedFilters.range) {
      const { startDate, endDate } = appliedFilters.range;
      const label = getHumanizedLabel(startDate, endDate);

      list.push({
        key: 'range',
        label,
      });
    }

    if (appliedFilters.categoryIds && appliedFilters.categoryIds.length > 0) {
      list.push({
        key: 'categoryIds',
        label: 'Categories',
      });
    }

    if (appliedFilters.accountIds && appliedFilters.accountIds.length > 0) {
      list.push({
        key: 'accountIds',
        label: 'Accounts',
      });
    }

    return list;
  })();

  const setFilters = (newFilters: SummaryFilterModel) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFiltes = {
      dateStart: newFilters.range.startDate.toISOString(),
      dateEnd: newFilters.range.endDate.toISOString(),
      categoryIds: newFilters.categoryIds,
      accountIds: newFilters.accountIds,
    };

    Object.entries(parsedNewFiltes).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        stringifiedFilters[key] = value.map(String);
      } else if (value !== undefined && value !== null) {
        stringifiedFilters[key] = String(value);
      }
    });

    setSearchParams(stringifiedFilters, { replace: true });
  };

  const removeFilter = (key: keyof SummaryFilterModel) => {
    if (key === 'range') {
      searchParams.delete('dateStart');
      searchParams.delete('dateEnd');
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const removeAllFilters = () => {
    searchParams.delete('dateStart');
    searchParams.delete('dateEnd');
    searchParams.delete('categoryIds');
    searchParams.delete('accountIds');
    setSearchParams(searchParams, { replace: true });
  };

  const getCurrentFrequency = (): SummaryFrequencyType | null => {
    if (!appliedFilters.range) return null;

    const { startDate, endDate } = appliedFilters.range;
    const label = getHumanizedLabel(startDate, endDate);
    return humanizedLabelToFrequency(label);
  };

  return {
    appliedFilters,
    humanizedFilters,
    setFilters,
    getCurrentFrequency,
    removeFilter,
    removeAllFilters,
    frequencyToDateRange,
  };
};

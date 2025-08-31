import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const enum SummaryFrequencyType {
  thisWeek = 'thisWeek',
  lastWeek = 'lastWeek',
  thisMonth = 'thisMonth',
  lastMonth = 'lastMonth',
  thisYear = 'thisYear',
  allTheTime = 'allTheTime',
  custom = 'custom',
}

export type SummaryFilterModel = {
  range: {
    startDate: Dayjs;
    endDate: Dayjs;
  };
  categoryIds?: number[];
  accountIds?: number[];
};

// Helper function to convert frequency to date range
const frequencyToDateRange = (frequency: SummaryFrequencyType, firstDate: Dayjs) => {
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
      dateStart = firstDate;
      dateEnd = dayjs();
  }

  return { startDate: dateStart, endDate: dateEnd };
};

// Helper function to convert humanized label to frequency
const humanizedLabelToFrequency = (label: string): SummaryFrequencyType => {
  const labelMap: Record<string, SummaryFrequencyType> = {
    'This Week': SummaryFrequencyType.thisWeek,
    'Last Week': SummaryFrequencyType.lastWeek,
    'This Month': SummaryFrequencyType.thisMonth,
    'Last Month': SummaryFrequencyType.lastMonth,
    'This Year': SummaryFrequencyType.thisYear,
    'All Time': SummaryFrequencyType.allTheTime,
  };

  return labelMap[label] || SummaryFrequencyType.custom;
};

// Helper function to get humanized label from date range
const getHumanizedLabel = (startDate: Dayjs, endDate: Dayjs, firstDate: Dayjs): string => {
  const today = dayjs();

  if (startDate.isSame(today.startOf('week'), 'day') && endDate.isSame(today.endOf('week'), 'day')) {
    return 'This Week';
  } else if (
    startDate.isSame(today.subtract(1, 'week').startOf('week'), 'day') &&
    endDate.isSame(today.subtract(1, 'week').endOf('week'), 'day')
  ) {
    return 'Last Week';
  } else if (startDate.isSame(today.startOf('month'), 'day') && endDate.isSame(today.endOf('month'), 'day')) {
    return 'This Month';
  } else if (
    startDate.isSame(today.subtract(1, 'month').startOf('month'), 'day') &&
    endDate.isSame(today.subtract(1, 'month').endOf('month'), 'day')
  ) {
    return 'Last Month';
  } else if (startDate.isSame(today.startOf('year'), 'day') && endDate.isSame(today.endOf('year'), 'day')) {
    return 'This Year';
  } else if (startDate.isSame(firstDate, 'day') && endDate.isSame(today, 'day')) {
    return 'All Time';
  }

  return 'Custom Range';
};

export const useSummaryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [firstTransaction] = useApiSpenicleTransactionsInfiniteQuery({
    pageSize: 1,
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const firstDate = dayjs(firstTransaction?.[0]?.date ?? dayjs().toISOString());

  const parsedParams = useMemo(() => {
    const rawDateStart = searchParams.get('dateStart');
    const rawDateEnd = searchParams.get('dateEnd');
    const categoryIds = searchParams
      .getAll('categoryIds')
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    const accountIds = searchParams
      .getAll('accountIds')
      .map(Number)
      .filter((n) => !Number.isNaN(n));

    return {
      rawDateStart,
      rawDateEnd,
      categoryIds,
      accountIds,
    };
  }, [searchParams]);
  const setFilters = (newFilters: SummaryFilterModel) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFilters = {
      dateStart: newFilters.range.startDate.toISOString(),
      dateEnd: newFilters.range.endDate.toISOString(),
      categoryIds: newFilters.categoryIds,
      accountIds: newFilters.accountIds,
    };

    Object.entries(parsedNewFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        stringifiedFilters[key] = value.map(String);
      } else if (value !== undefined && value !== null) {
        stringifiedFilters[key] = String(value);
      }
    });

    setSearchParams(stringifiedFilters, { replace: true });
  };

  useEffect(() => {
    if (parsedParams.rawDateStart === null && parsedParams.rawDateEnd === null) {
      setFilters({
        range: {
          startDate: dayjs().startOf('week'),
          endDate: dayjs().endOf('week'),
        },
        categoryIds: parsedParams.categoryIds,
        accountIds: parsedParams.accountIds,
      });
    }
  }, [parsedParams.rawDateStart, parsedParams.rawDateEnd]);

  let dateStart = dayjs().startOf('week');
  let dateEnd = dayjs().endOf('week');
  if (parsedParams.rawDateStart) dateStart = dayjs(parsedParams.rawDateStart);
  if (parsedParams.rawDateEnd) dateEnd = dayjs(parsedParams.rawDateEnd);

  const categoryIds = parsedParams.categoryIds;
  const accountIds = parsedParams.accountIds;

  const appliedFilters: SummaryFilterModel = useMemo(() => {
    return {
      range: {
        startDate: dateStart,
        endDate: dateEnd,
      },
      categoryIds,
      accountIds,
    };
  }, [dateStart, dateEnd, categoryIds, accountIds]);

  const humanizedFilters = (() => {
    const list: {
      key: keyof SummaryFilterModel;
      label: string;
    }[] = [];

    if (appliedFilters.range) {
      const { startDate, endDate } = appliedFilters.range;
      const label = getHumanizedLabel(startDate, endDate, firstDate);

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

  const removeFilter = (key: keyof SummaryFilterModel) => {
    if (key === 'range') {
      searchParams.delete('dateStart');
      searchParams.delete('dateEnd');
    } else {
      // key is a union type; convert to string to be explicit
      searchParams.delete(String(key));
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

  const getCurrentFrequency = (): SummaryFrequencyType => {
    const { startDate, endDate } = appliedFilters.range;
    const label = getHumanizedLabel(startDate, endDate, firstDate);
    return humanizedLabelToFrequency(label);
  };

  const frequency = getCurrentFrequency();

  const curriedFrequencyToDateRange = (frequency: SummaryFrequencyType) => frequencyToDateRange(frequency, firstDate);

  return {
    appliedFilters,
    humanizedFilters,
    frequency,
    setFilters,
    removeFilter,
    removeAllFilters,
    frequencyToDateRange: curriedFrequencyToDateRange,
  };
};

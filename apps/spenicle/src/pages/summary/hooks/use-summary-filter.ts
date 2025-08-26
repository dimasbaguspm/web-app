import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export type SummaryFilterModel = {
  range: {
    startDate: Dayjs;
    endDate: Dayjs;
  };
};

export const useSummaryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [plainDateStart, plainDateEnd] = [
    searchParams.get('dateStart'),
    searchParams.get('dateEnd'),
  ];

  useEffect(() => {
    if (plainDateStart === null && plainDateEnd === null) {
      setFilters({
        range: {
          startDate: dayjs().startOf('week'),
          endDate: dayjs().endOf('week'),
        },
      });
    }
  }, [plainDateStart, plainDateEnd]);

  const [dateStart, dateEnd] = [
    plainDateStart ? dayjs(plainDateStart) : dayjs().startOf('week'),
    plainDateEnd ? dayjs(plainDateEnd) : dayjs().endOf('week'),
  ];

  const appliedFilters: SummaryFilterModel = {
    range: {
      startDate: dateStart,
      endDate: dateEnd,
    },
  };

  const humanizedFilters = (() => {
    const list: {
      key: keyof SummaryFilterModel;
      label: string;
    }[] = [];

    if (appliedFilters.range) {
      const { startDate, endDate } = appliedFilters.range;
      const today = dayjs();

      let label = 'Custom Range';

      // Check if it's this week
      if (
        startDate.isSame(today.startOf('week'), 'day') &&
        endDate.isSame(today.endOf('week'), 'day')
      ) {
        label = 'This Week';
      }
      // Check if it's last week
      else if (
        startDate.isSame(today.subtract(1, 'week').startOf('week'), 'day') &&
        endDate.isSame(today.subtract(1, 'week').endOf('week'), 'day')
      ) {
        label = 'Last Week';
      }
      // Check if it's this month
      else if (
        startDate.isSame(today.startOf('month'), 'day') &&
        endDate.isSame(today.endOf('month'), 'day')
      ) {
        label = 'This Month';
      }
      // Check if it's last month
      else if (
        startDate.isSame(today.subtract(1, 'month').startOf('month'), 'day') &&
        endDate.isSame(today.subtract(1, 'month').endOf('month'), 'day')
      ) {
        label = 'Last Month';
      }

      list.push({
        key: 'range',
        label,
      });
    }

    return list;
  })();

  const setFilters = (newFilters: SummaryFilterModel) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFiltes = {
      dateStart: newFilters.range.startDate.toISOString(),
      dateEnd: newFilters.range.endDate.toISOString(),
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
    setSearchParams(searchParams, { replace: true });
  };

  return {
    appliedFilters,
    humanizedFilters,
    setFilters,
    removeFilter,
    removeAllFilters,
  };
};

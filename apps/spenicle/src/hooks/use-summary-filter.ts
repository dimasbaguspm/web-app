import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchSummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import dayjs, { Dayjs } from 'dayjs';

export interface SummaryFilterModel extends Record<string, unknown> {
  dateFrom?: string;
  dateTo?: string;
  frequency?: FilterFrequency;
  accountId?: SearchSummaryTransactionsModel['accountId'];
  categoryId?: SearchSummaryTransactionsModel['categoryId'];
}

const FILTERS = ['dateFrom', 'dateTo', 'frequency', 'accountId', 'categoryId'] satisfies (keyof SummaryFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof SummaryFilterModel, string> = {
  accountId: 'Account',
  categoryId: 'Category',
  frequency: 'Frequency',
} as const;

export enum FilterDateRangePresets {
  Last7Days = 'last_7_days',
  Last30Days = 'last_30_days',
  ThisWeek = 'this_week',
  LastWeek = 'last_week',
  ThisMonth = 'this_month',
  LastMonth = 'last_month',
  ThisYear = 'this_year',
  LastYear = 'last_year',
  AllTime = 'all_time',
}

export enum FilterFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export const DATE_RANGE_PRESET_LABELS: Record<FilterDateRangePresets, string> = {
  [FilterDateRangePresets.Last7Days]: 'Last 7 Days',
  [FilterDateRangePresets.Last30Days]: 'Last 30 Days',
  [FilterDateRangePresets.ThisWeek]: 'This Week',
  [FilterDateRangePresets.LastWeek]: 'Last Week',
  [FilterDateRangePresets.ThisMonth]: 'This Month',
  [FilterDateRangePresets.LastMonth]: 'Last Month',
  [FilterDateRangePresets.ThisYear]: 'This Year',
  [FilterDateRangePresets.LastYear]: 'Last Year',
  [FilterDateRangePresets.AllTime]: 'All Time',
};

export const FREQUENCY_LABELS: Record<FilterFrequency, string> = {
  [FilterFrequency.Daily]: 'Daily',
  [FilterFrequency.Weekly]: 'Weekly',
  [FilterFrequency.Monthly]: 'Monthly',
  [FilterFrequency.Yearly]: 'Yearly',
};

const getDateRangeFromPreset = (
  preset: FilterDateRangePresets,
  firstDate?: dayjs.Dayjs,
): { dateFrom: string; dateTo: string } => {
  const now = dayjs();

  switch (preset) {
    case FilterDateRangePresets.Last7Days:
      return {
        dateFrom: now.subtract(7, 'days').startOf('day').toISOString(),
        dateTo: now.endOf('day').toISOString(),
      };
    case FilterDateRangePresets.Last30Days:
      return {
        dateFrom: now.subtract(30, 'days').startOf('day').toISOString(),
        dateTo: now.endOf('day').toISOString(),
      };
    case FilterDateRangePresets.ThisWeek:
      return {
        dateFrom: now.startOf('week').toISOString(),
        dateTo: now.endOf('week').toISOString(),
      };
    case FilterDateRangePresets.LastWeek:
      return {
        dateFrom: now.subtract(1, 'week').startOf('week').toISOString(),
        dateTo: now.subtract(1, 'week').endOf('week').toISOString(),
      };
    case FilterDateRangePresets.ThisMonth:
      return {
        dateFrom: now.startOf('month').toISOString(),
        dateTo: now.endOf('month').toISOString(),
      };
    case FilterDateRangePresets.LastMonth:
      return {
        dateFrom: now.subtract(1, 'month').startOf('month').toISOString(),
        dateTo: now.subtract(1, 'month').endOf('month').toISOString(),
      };
    case FilterDateRangePresets.ThisYear:
      return {
        dateFrom: now.startOf('year').toISOString(),
        dateTo: now.endOf('year').toISOString(),
      };
    case FilterDateRangePresets.LastYear:
      return {
        dateFrom: now.subtract(1, 'year').startOf('year').toISOString(),
        dateTo: now.subtract(1, 'year').endOf('year').toISOString(),
      };
    case FilterDateRangePresets.AllTime:
      return {
        dateFrom: firstDate?.toISOString() ?? dayjs('2000-01-01').toISOString(),
        dateTo: now.endOf('day').toISOString(),
      };
    default:
      return {
        dateFrom: now.startOf('month').toISOString(),
        dateTo: now.endOf('month').toISOString(),
      };
  }
};

const detectDateRangePreset = (dateFrom: string, dateTo: string, firstDate?: Dayjs): FilterDateRangePresets | null => {
  for (const preset of Object.values(FilterDateRangePresets)) {
    const presetRange = getDateRangeFromPreset(preset, firstDate);
    if (
      dayjs(dateFrom).isSame(dayjs(presetRange.dateFrom), 'day') &&
      dayjs(dateTo).isSame(dayjs(presetRange.dateTo), 'day')
    ) {
      return preset;
    }
  }
  return null;
};

export const useSummaryFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<SummaryFilterModel>(opts);

  const [firstTransaction] = useApiSpenicleTransactionsInfiniteQuery({
    pageSize: 1,
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const firstDate = dayjs(firstTransaction?.[0]?.date ?? dayjs().toISOString());

  // Default date range (this month)
  const defaultDateRange = getDateRangeFromPreset(FilterDateRangePresets.ThisMonth, firstDate);

  // parse applied filters with proper typing, ensuring all 4 keys are always present
  const appliedFilters: Required<SummaryFilterModel> = {
    dateFrom: filters.getSingle('dateFrom') ?? defaultDateRange.dateFrom,
    dateTo: filters.getSingle('dateTo') ?? defaultDateRange.dateTo,
    frequency: (filters.getSingle('frequency') as FilterFrequency) ?? FilterFrequency.Monthly,
    accountId: filters.getAll('accountId').map(Number) || [],
    categoryId: filters.getAll('categoryId').map(Number) || [],
  };

  // Detect current date range preset
  const currentDateRangePreset = detectDateRangePreset(appliedFilters.dateFrom, appliedFilters.dateTo, firstDate);

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'dateFrom':
        case 'dateTo':
          // Use preset label if available, otherwise show "Custom Date Range"
          if (appliedFilters.dateFrom || appliedFilters.dateTo) {
            const label = currentDateRangePreset
              ? DATE_RANGE_PRESET_LABELS[currentDateRangePreset]
              : 'Custom Date Range';
            acc.push([key, label]);
          }
          break;
        case 'frequency':
          if (appliedFilters.frequency) {
            const frequencyLabel = FREQUENCY_LABELS[appliedFilters.frequency];
            acc.push([key, frequencyLabel]);
          }
          break;
        case 'accountId':
          if (appliedFilters.accountId?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'categoryId':
          if (appliedFilters.categoryId?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof SummaryFilterModel, string][],
  );

  // Method to set date range by preset
  const setDateRangePreset = (preset: FilterDateRangePresets) => {
    const { dateFrom, dateTo } = getDateRangeFromPreset(preset);
    filters.replaceAll({
      dateFrom,
      dateTo,
      frequency: appliedFilters.frequency,
      accountId: appliedFilters.accountId,
      categoryId: appliedFilters.categoryId,
    });
  };

  // Method to set frequency
  const setFrequency = (frequency: FilterFrequency) => {
    filters.replaceSingle('frequency', frequency);
  };

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,
    currentDateRangePreset,

    // Date range preset utilities
    DATE_RANGE_PRESET_LABELS,
    setDateRangePreset,
    getDateRangeFromPreset,

    // Frequency utilities
    FREQUENCY_LABELS,
    setFrequency,

    // Convenience methods for common operations
    removeFilter: (key: keyof SummaryFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};

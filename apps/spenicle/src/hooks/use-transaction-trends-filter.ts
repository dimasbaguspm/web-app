import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchSummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import dayjs from 'dayjs';

export interface TransactionTrendsFilterModel extends Record<string, unknown> {
  metric: 'net' | 'income' | 'expense';
  startDate: SearchSummaryTransactionsModel['from'];
  endDate: SearchSummaryTransactionsModel['to'];
  frequency: NonNullable<SearchSummaryTransactionsModel['frequency']>;
}

const FILTERS = ['metric'] satisfies (keyof TransactionTrendsFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof TransactionTrendsFilterModel, string> = {
  metric: 'Metric',
  startDate: 'Start Date',
  endDate: 'End Date',
  frequency: 'Frequency',
} as const;

export const useTransactionTrendsFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<TransactionTrendsFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: TransactionTrendsFilterModel = {
    metric: (filters.getSingle('metric') as 'net' | 'income' | 'expense') || 'expense',
    startDate: (filters.getSingle('startDate') as string) || dayjs().startOf('year').add(1, 'day').toISOString(),
    endDate: (filters.getSingle('endDate') as string) || dayjs().endOf('month').toISOString(),
    frequency: (filters.getSingle('frequency') as SearchSummaryTransactionsModel['frequency']) || 'monthly',
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'metric':
          if (appliedFilters.metric) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'startDate':
          if (appliedFilters.startDate) {
            acc.push([key, formatDate(appliedFilters.startDate, DateFormat.COMPACT_DATE)]);
          }
          break;
        case 'endDate':
          if (appliedFilters.endDate) {
            acc.push([key, formatDate(appliedFilters.endDate, DateFormat.COMPACT_DATE)]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof TransactionTrendsFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof TransactionTrendsFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};

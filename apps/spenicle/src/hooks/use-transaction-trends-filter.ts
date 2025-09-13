import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';

export interface TransactionTrendsFilterModel extends Record<string, unknown> {
  metric: 'net' | 'income' | 'expense';
}

const FILTERS = ['metric'] satisfies (keyof TransactionTrendsFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof TransactionTrendsFilterModel, string> = {
  metric: 'Metric',
} as const;

export const useTransactionTrendsFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<TransactionTrendsFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: TransactionTrendsFilterModel = {
    metric: (filters.getSingle('metric') as 'net' | 'income' | 'expense') || 'expense',
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

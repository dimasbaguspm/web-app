import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchTransactionsModel } from '@dimasbaguspm/interfaces';

export interface TransactionFilterModel extends Record<string, unknown> {
  type?: SearchTransactionsModel['type'];
  accountId?: SearchTransactionsModel['accountId'];
  categoryId?: SearchTransactionsModel['categoryId'];
}

const FILTERS = ['type', 'accountId', 'categoryId'] satisfies (keyof TransactionFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof TransactionFilterModel, string> = {
  type: 'Type',
  accountId: 'Account',
  categoryId: 'Category',
} as const;

export const useTransactionFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<TransactionFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: TransactionFilterModel = {
    type: filters.getAll('type') as SearchTransactionsModel['type'],
    accountId: filters.getAll('accountId').map(Number) as SearchTransactionsModel['accountId'],
    categoryId: filters.getAll('categoryId').map(Number) as SearchTransactionsModel['categoryId'],
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'type':
          if (appliedFilters.type?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
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
    [] as [keyof TransactionFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof TransactionFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};

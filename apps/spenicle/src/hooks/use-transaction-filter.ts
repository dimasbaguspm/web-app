import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';

export interface TransactionFilterModel extends Record<string, unknown> {
  type?: SearchTransactionsModel['type'];
  accountId?: SearchTransactionsModel['accountId'];
  categoryId?: SearchTransactionsModel['categoryId'];
  startDate?: SearchTransactionsModel['dateFrom'];
  endDate?: SearchTransactionsModel['dateTo'];
}

const FILTERS = ['type', 'accountId', 'categoryId', 'startDate', 'endDate'] satisfies (keyof TransactionFilterModel)[];

export const useTransactionFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<TransactionFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: TransactionFilterModel = {
    type: filters.getAll('type') as SearchTransactionsModel['type'],
    accountId: filters.getAll('accountId').map(Number) as SearchTransactionsModel['accountId'],
    categoryId: filters.getAll('categoryId').map(Number) as SearchTransactionsModel['categoryId'],
    startDate: filters.getSingle('startDate') as SearchTransactionsModel['dateFrom'],
    endDate: filters.getSingle('endDate') as SearchTransactionsModel['dateTo'],
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'type':
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
        case 'accountId':
          if (appliedFilters.accountId?.length) {
            const label = appliedFilters.accountId.length === 1 ? 'Account' : 'Accounts';
            acc.push([key, `${appliedFilters.accountId.length} ${label}`]);
          }
          break;
        case 'categoryId':
          if (appliedFilters.categoryId?.length) {
            const label = appliedFilters.categoryId.length === 1 ? 'Category' : 'Categories';
            acc.push([key, `${appliedFilters.categoryId.length} ${label}`]);
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

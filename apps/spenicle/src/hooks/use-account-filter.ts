import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchAccountsModel } from '@dimasbaguspm/interfaces';

export interface AccountFilterModel extends Record<string, unknown> {
  type?: NonNullable<SearchAccountsModel>['type'];
  groupId?: NonNullable<SearchAccountsModel>['accountGroupIds'];
}

const FILTERS = ['q', 'type', 'groupId', 'sortBy'] satisfies (keyof AccountFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof AccountFilterModel, string> = {
  type: 'Type',
  groupId: 'Groups',
} as const;

export const useAccountFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<AccountFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: AccountFilterModel = {
    q: filters.getSingle('q'),
    type: filters.getAll('type') as NonNullable<SearchAccountsModel>['type'],
    sortBy: filters.getSingle('sortBy') as AccountFilterModel['sortBy'],
    groupId: filters.getAll('groupId').map(Number) as NonNullable<SearchAccountsModel>['accountGroupIds'],
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'q':
          if (appliedFilters.q) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'groupId':
          if (appliedFilters.groupId?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'type':
          if (appliedFilters.type?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'sortBy':
          if (appliedFilters.sortBy) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof AccountFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof AccountFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};

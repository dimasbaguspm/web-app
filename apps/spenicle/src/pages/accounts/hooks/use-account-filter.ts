import { SearchAccountsModel } from '@dimasbaguspm/interfaces';
import { useSearchParams } from 'react-router';

export interface AccountFilterModel {
  q?: NonNullable<SearchAccountsModel>['search'];
  type?: NonNullable<SearchAccountsModel>['type'];
}

const FILTERS = ['q', 'type'] satisfies (keyof AccountFilterModel)[];

export const useAccountFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedFilters = {
    q: searchParams.get('q') ?? undefined,
    type: (searchParams.getAll('type') ??
      []) as NonNullable<SearchAccountsModel>['type'],
  } satisfies AccountFilterModel;

  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'q':
          if (appliedFilters.q) {
            acc.push(['q', 'Name']);
          }
          break;
        case 'type':
          if (appliedFilters.type?.length) {
            acc.push(['type', 'Type']);
          }
          break;
      }
      return acc;
    },
    [] as [keyof AccountFilterModel, string][],
  );

  const setFilters = (newFilters: AccountFilterModel) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFilters = {
      q: newFilters.q,
      type: newFilters.type,
    };

    Object.entries(parsedNewFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        stringifiedFilters[key] = value.map(String);
      } else if (value !== undefined && value !== null && value !== '') {
        stringifiedFilters[key] = String(value);
      }
    });

    setSearchParams(stringifiedFilters, { replace: true });
  };

  const removeFilter = (key: keyof AccountFilterModel) => {
    searchParams.delete(key);

    setSearchParams(searchParams, { replace: true });
  };

  const removeAllFilters = () => {
    FILTERS.forEach((key) => {
      searchParams.delete(key);
    });
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

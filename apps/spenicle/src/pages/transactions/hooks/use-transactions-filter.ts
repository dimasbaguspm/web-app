import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

export type TransactionFilterModel = {
  accountId: number[];
  categoryId: number[];
  type: ('income' | 'expense' | 'transfer')[];
};

export const useTransactionsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // canonical filters derived from URLSearchParams
  const filters = useMemo(
    () => ({
      accountId: searchParams.getAll('accountId').map(Number),
      categoryId: searchParams.getAll('categoryId').map(Number),
      type: searchParams.getAll('type') as ('income' | 'expense' | 'transfer')[],
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (newFilters: Partial<TransactionFilterModel>) => {
      const stringifiedFilters: Record<string, string | string[]> = {};

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          stringifiedFilters[key] = value.map(String);
        } else if (value !== undefined && value !== null) {
          stringifiedFilters[key] = String(value);
        }
      });

      setSearchParams(stringifiedFilters, { replace: true });
    },
    [setSearchParams],
  );

  const removeFilter = useCallback(
    (key: keyof TransactionFilterModel) => {
      searchParams.delete(String(key));
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const removeAllFilters = useCallback(() => {
    searchParams.delete('accountId');
    searchParams.delete('categoryId');
    searchParams.delete('type');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const appliedFilters = useMemo(() => {
    const acc: Partial<TransactionFilterModel> = {};

    if (Array.isArray(filters.accountId) && filters.accountId.length > 0) acc.accountId = filters.accountId;

    if (Array.isArray(filters.categoryId) && filters.categoryId.length > 0) acc.categoryId = filters.categoryId;

    if (Array.isArray(filters.type) && filters.type.length > 0) {
      acc.type = filters.type;
    }

    return acc as TransactionFilterModel;
  }, [filters]);

  // ordered, human-readable filter names for the UI
  const humanizedFilters = useMemo(() => {
    const list: {
      key: keyof TransactionFilterModel;
      label: string;
    }[] = [];

    if (Array.isArray(filters.accountId) && filters.accountId.length > 0) {
      list.push({ key: 'accountId', label: 'Account' });
    }

    if (Array.isArray(filters.type) && filters.type.length > 0) {
      list.push({ key: 'type', label: 'Type' });
    }

    if (Array.isArray(filters.categoryId) && filters.categoryId.length > 0) {
      list.push({ key: 'categoryId', label: 'Category' });
    }
    return list;
  }, [filters]);

  return {
    appliedFilters,
    humanizedFilters,
    removeFilter,
    setFilters,
    removeAllFilters,
  };
};

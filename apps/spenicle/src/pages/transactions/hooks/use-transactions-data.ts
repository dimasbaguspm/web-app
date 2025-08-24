import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleTransactionsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Dayjs } from 'dayjs';

import { useTransactionsFilter } from './use-transactions-filter';

interface UseTransactionDataProps {
  date: Dayjs;
}

export const useTransactionData = (props: UseTransactionDataProps) => {
  const { date } = props ?? {};

  const { appliedFilters } = useTransactionsFilter();

  const [transactions, , { isFetching: isFetchingTransactions }] =
    useApiSpenicleTransactionsPaginatedQuery({
      accountId: appliedFilters?.accountId ? [appliedFilters.accountId] : [],
      categoryId: appliedFilters?.categoryId ? [appliedFilters.categoryId] : [],
      type: appliedFilters?.type ? [appliedFilters.type] : [],
      dateFrom: formatDate(date.startOf('day'), DateFormat.ISO_DATETIME),
      dateTo: formatDate(date.endOf('day'), DateFormat.ISO_DATETIME),
      pageSize: 15,
      sortBy: 'date',
    });

  const accountIds = [
    ...new Set(transactions?.items.map((item) => item.accountId)),
  ];
  const categoryIds = [
    ...new Set(transactions?.items.map((item) => item.categoryId)),
  ];

  const [accounts, , { isFetching: isFetchingAccounts }] =
    useApiSpenicleAccountsPaginatedQuery(
      {
        id: accountIds,
        pageSize: 100,
      },
      {
        enabled: Boolean(accountIds?.length),
      },
    );

  const [categories, , { isFetching: isFetchingCategories }] =
    useApiSpenicleCategoriesPaginatedQuery(
      {
        id: categoryIds,
        pageSize: 100,
      },
      {
        enabled: Boolean(categoryIds?.length),
      },
    );

  const isFetching =
    isFetchingTransactions || isFetchingAccounts || isFetchingCategories;

  return {
    isFetching,
    transactions,
    accounts,
    categories,
  };
};

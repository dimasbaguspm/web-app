import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleTransactionsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Dayjs } from 'dayjs';

import { useTransactionFilter } from '../../../hooks/use-transaction-filter';

interface UseTransactionDataProps {
  date: Dayjs;
}

export const useTransactionData = (props: UseTransactionDataProps) => {
  const { date } = props ?? {};

  const { appliedFilters } = useTransactionFilter({ adapter: 'url' });

  const [transactions, , { hasNextPage, isLoading: isLoadingTransactions, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleTransactionsInfiniteQuery({
      accountId: appliedFilters?.accountId ? appliedFilters.accountId : [],
      categoryId: appliedFilters?.categoryId ? appliedFilters.categoryId : [],
      type: appliedFilters?.type ? appliedFilters.type : [],
      dateFrom: formatDate(date.startOf('day'), DateFormat.ISO_DATETIME),
      dateTo: formatDate(date.endOf('day'), DateFormat.ISO_DATETIME),
      pageSize: 15,
      sortBy: 'date',
    });

  const accountIds = [...new Set(transactions.map((item) => item.accountId))];
  const categoryIds = [...new Set(transactions.map((item) => item.categoryId))];

  const [accounts] = useApiSpenicleAccountsPaginatedQuery(
    {
      id: accountIds,
      pageSize: 100,
    },
    {
      enabled: Boolean(accountIds?.length),
    },
  );

  const [categories] = useApiSpenicleCategoriesPaginatedQuery(
    {
      id: categoryIds,
      pageSize: 100,
    },
    {
      enabled: Boolean(categoryIds?.length),
    },
  );

  return {
    isLoading: isLoadingTransactions,
    transactions,
    accounts,
    categories,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};

import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import { FilterFrequency, useSummaryFilter } from '../../../hooks/use-summary-filter';

interface MostActiveDayProps {
  data: SummaryTransactionsModel;
}

export const TotalTransactions: FC<MostActiveDayProps> = ({ data }) => {
  const { appliedFilters } = useSummaryFilter();

  const periodGranularity = (() => {
    switch (appliedFilters.frequency) {
      case FilterFrequency.Yearly:
        return 'year';
      case FilterFrequency.Monthly:
        return 'month';
      case FilterFrequency.Weekly:
        return 'week';
      default:
        return 'day';
    }
  })();

  const { transactionCount } = useGeneralSummaryStats(data, {
    periodGranularity: periodGranularity,
  });

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Total transactions
      </Text>
      <If condition={transactionCount}>
        <Text fontWeight="semibold" fontSize="lg">
          {transactionCount}
        </Text>
        <Text fontSize="xs" color="gray">
          Recorded
        </Text>
      </If>
      <If condition={!transactionCount}>
        <Text fontWeight="semibold" fontSize="lg">
          No activity recorded
        </Text>
      </If>
    </Tile>
  );
};

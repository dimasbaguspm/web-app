import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { lowerCase } from 'lodash';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import { FilterFrequency, useSummaryFilter } from '../../../hooks/use-summary-filter';

interface AverageLoggedTransactionProps {
  data: SummaryTransactionsModel;
}

export const AverageLoggedTransaction: FC<AverageLoggedTransactionProps> = ({ data }) => {
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

  const { avgTransactionsPerUnit } = useGeneralSummaryStats(data, {
    periodGranularity,
  });

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Average {lowerCase(appliedFilters.frequency)} transactions
      </Text>
      <If condition={avgTransactionsPerUnit > 0}>
        <Text fontWeight="semibold" fontSize="lg">
          {avgTransactionsPerUnit.toFixed(1)}
        </Text>
        <Text fontSize="xs" color="gray">
          Per period
        </Text>
      </If>
      <If condition={avgTransactionsPerUnit === 0}>
        <Text fontWeight="semibold" fontSize="lg">
          No transactions
        </Text>
      </If>
    </Tile>
  );
};

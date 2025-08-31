import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import { SummaryFrequencyType, useSummaryFilter } from '../../summary/hooks/use-summary-filter';

interface HighestSpendProps {
  data: SummaryTransactionsModel;
}

export const HighestSpend: FC<HighestSpendProps> = ({ data }) => {
  const { frequency } = useSummaryFilter();

  const periodGranularity = (() => {
    switch (frequency) {
      case SummaryFrequencyType.allTheTime:
        return 'year';
      case SummaryFrequencyType.thisYear:
        return 'month';
      case SummaryFrequencyType.thisMonth:
      case SummaryFrequencyType.lastMonth:
        return 'week';
      default:
        return 'day';
    }
  })();

  const { maxExpenseDateInPeriod, maxExpenseInPeriod } = useGeneralSummaryStats(data, {
    periodGranularity,
  });

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Highest spend
      </Text>
      <If condition={maxExpenseInPeriod !== 0}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatPrice(maxExpenseInPeriod)}
        </Text>
        <Text fontSize="xs" color="gray">
          {maxExpenseDateInPeriod}
        </Text>
      </If>
      <If condition={maxExpenseInPeriod === 0}>
        <Text fontWeight="semibold" fontSize="lg">
          No spend recorded
        </Text>
      </If>
    </Tile>
  );
};

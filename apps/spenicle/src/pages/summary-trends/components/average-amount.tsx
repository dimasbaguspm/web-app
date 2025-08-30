import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import {
  SummaryFrequencyType,
  useSummaryFilter,
} from '../../summary/hooks/use-summary-filter';

interface AverageAmountProps {
  data: SummaryTransactionsModel;
}

export const AverageAmount: FC<AverageAmountProps> = ({ data }) => {
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

  const { avgTransactionValue } = useGeneralSummaryStats(data, {
    metric: 'net',
    periodGranularity,
  });

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Average amount
      </Text>
      <If condition={avgTransactionValue !== 0}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatPrice(avgTransactionValue, Currency.IDR, { compact: true })}
        </Text>
        <Text fontSize="xs" color="gray">
          Net per transaction
        </Text>
      </If>
      <If condition={avgTransactionValue === 0}>
        <Text fontWeight="semibold" fontSize="lg">
          No transactions
        </Text>
      </If>
    </Tile>
  );
};

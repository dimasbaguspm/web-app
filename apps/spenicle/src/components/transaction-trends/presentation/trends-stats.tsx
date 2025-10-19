import { SearchSummaryTransactionsModel, SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Heading, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import { useGrowthSummaryStats } from '../../../hooks/use-growth-summary-stats';

interface TrendsStatsProps {
  transactions: SummaryTransactionsModel;
  frequency: NonNullable<SearchSummaryTransactionsModel['frequency']>;
  metric: 'net' | 'income' | 'expense';
}

export const TrendsStats: FC<TrendsStatsProps> = ({ transactions, metric, frequency }) => {
  const getPeriodGranularity = (): 'day' | 'week' | 'month' | 'year' => {
    switch (frequency) {
      case 'daily':
        return 'day';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
      default:
        return 'month';
    }
  };

  const getPeakLabel = () => {
    switch (frequency) {
      case 'daily':
        return 'Peak Day';
      case 'weekly':
        return 'Peak Week';
      case 'monthly':
        return 'Peak Month';
      case 'yearly':
        return 'Peak Year';
      default:
        return 'Peak Period';
    }
  };

  const generalStats = useGeneralSummaryStats(transactions, {
    metric: metric,
    periodGranularity: getPeriodGranularity(),
  });
  const growthStats = useGrowthSummaryStats(transactions, {
    metric: metric,
  });

  return (
    <>
      <div className="mb-4">
        <Heading level={3}>Summary</Heading>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Total
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {formatPrice(generalStats.metricTotal, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Average
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {formatPrice(generalStats.metricAveragePerPeriod, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Highest
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {formatPrice(generalStats.metricMax, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Text fontWeight="medium" fontSize="sm" color="gray">
              Growth
            </Text>
            <Icon as={growthStats.TrendIcon} size="xs" color={growthStats.getTrendColor(metric === 'expense')} />
          </div>
          <Text fontWeight="semibold" fontSize="lg">
            {growthStats.formattedPercentage}
          </Text>
          <Text fontSize="xs" color="gray">
            {growthStats.amount > 0 ? '+' : ''}
            {formatPrice(growthStats.amount, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Transactions
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {generalStats.transactionCount}
          </Text>
          <Text fontSize="xs" color="gray">
            Total count
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            {getPeakLabel()}
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {generalStats.peakPeriodFormatted}
          </Text>
          <Text fontSize="xs" color="gray">
            {formatPrice(generalStats.metricMax, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>
      </div>
    </>
  );
};

import {
  CategoryModel,
  SummaryTransactionsModel,
} from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGeneralSummaryStats } from '../../../hooks/use-general-summary-stats';
import { useGrowthSummaryStats } from '../../../hooks/use-growth-summary-stats';

interface TrendsStatsProps {
  data: CategoryModel;
  transactions: SummaryTransactionsModel;
}

export const TrendsStats: FC<TrendsStatsProps> = ({ data, transactions }) => {
  const { isExpense, isTransfer } = formatSpenicleCategory(data);

  const generalStats = useGeneralSummaryStats(transactions, {
    metric: isExpense ? 'expense' : isTransfer ? 'transfer' : 'income',
    periodGranularity: 'month',
  });
  const growthStats = useGrowthSummaryStats(transactions, {
    metric: isExpense ? 'expense' : isTransfer ? 'transfer' : 'income',
  });

  return (
    <>
      <div className="mb-4">
        <Text fontWeight="medium" fontSize="lg" color="black">
          Summary
        </Text>
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
            <Icon
              as={growthStats.TrendIcon}
              size="xs"
              color={growthStats.getTrendColor(isExpense)}
            />
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
            Peak Month
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {generalStats.peakPeriodByHighestNet}
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

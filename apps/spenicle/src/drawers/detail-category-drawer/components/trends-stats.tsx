import {
  CategoryModel,
  SummaryTransactionsModel,
} from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

interface TrendsStatsProps {
  data: CategoryModel;
  transactions: SummaryTransactionsModel;
}

export const TrendsStats: FC<TrendsStatsProps> = ({ data, transactions }) => {
  const { isExpense, isIncome } = formatSpenicleCategory(data);

  const dataKey = isExpense ? 'expense' : isIncome ? 'income' : 'transfer';

  const summaryStats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        growth: 0,
        growthPercentage: 0,
        trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
        totalTransactions: 0,
        peakMonth: '',
      };
    }

    const values = transactions.map((tx) => tx[dataKey]);

    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    // find peak month
    const peakIndex = values.indexOf(highest);
    const peakMonth = transactions[peakIndex]?.date || '';

    // calculate total transactions count
    const totalTransactions = transactions.reduce(
      (sum, tx) => sum + tx.totalTransactions,
      0,
    );

    // calculate growth based on period-over-period changes
    let totalGrowthPercentage = 0;
    let validPeriods = 0;

    // Calculate month-over-month growth rates
    for (let i = 1; i < values.length; i++) {
      const previousValue = values[i - 1];
      const currentValue = values[i];

      if (previousValue > 0) {
        const periodGrowth =
          ((currentValue - previousValue) / previousValue) * 100;
        totalGrowthPercentage += periodGrowth;
        validPeriods++;
      }
    }

    // Calculate average growth rate across all periods
    const averageGrowthPercentage =
      validPeriods > 0 ? totalGrowthPercentage / validPeriods : 0;

    // Also calculate absolute growth (first vs last for backward compatibility)
    const firstValue = values.find((val) => val > 0) || values[0] || 0;
    const lastValue = values[values.length - 1] || 0;
    const growth = lastValue - firstValue;

    // For display, use the average period growth rate as it's more representative
    let growthPercentage = averageGrowthPercentage;

    // Handle edge case: if no valid periods but we have first and last values
    if (validPeriods === 0 && firstValue !== 0) {
      growthPercentage =
        ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
    } else if (validPeriods === 0 && firstValue === 0 && lastValue > 0) {
      growthPercentage = 100;
    }

    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';

    if (firstValue !== 0 && lastValue !== 0) {
      if (lastValue > firstValue * 1.05) {
        trendDirection = 'up';
      } else if (lastValue < firstValue * 0.95) {
        trendDirection = 'down';
      }
    } else if (firstValue === 0 && lastValue > 0) {
      trendDirection = 'up';
    } else if (firstValue > 0 && lastValue === 0) {
      trendDirection = 'down';
    }

    return {
      total,
      average,
      highest,
      lowest,
      growth,
      growthPercentage,
      trendDirection,
      totalTransactions,
      peakMonth,
    };
  }, [transactions, dataKey]);

  const trendIcon = useMemo(() => {
    switch (summaryStats.trendDirection) {
      case 'up':
        return TrendingUpIcon;
      case 'down':
        return TrendingDownIcon;
      default:
        return MinusIcon;
    }
  }, [summaryStats.trendDirection]);

  const trendColor = useMemo(() => {
    switch (summaryStats.trendDirection) {
      case 'up':
        return isExpense ? 'primary' : 'secondary';
      case 'down':
        return isExpense ? 'secondary' : 'primary';
      default:
        return 'gray';
    }
  }, [summaryStats.trendDirection, isExpense]);

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
            {formatPrice(summaryStats.total, Currency.IDR, { compact: true })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Average
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {formatPrice(summaryStats.average, Currency.IDR, { compact: true })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Highest
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {formatPrice(summaryStats.highest, Currency.IDR, { compact: true })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Text fontWeight="medium" fontSize="sm" color="gray">
              Growth
            </Text>
            <Icon as={trendIcon} size="xs" color={trendColor} />
          </div>
          <Text fontWeight="semibold" fontSize="lg">
            {summaryStats.growthPercentage > 0 ? '+' : ''}
            {summaryStats.growthPercentage.toFixed(1)}%
          </Text>
          <Text fontSize="xs" color="gray">
            {summaryStats.growth > 0 ? '+' : ''}
            {formatPrice(summaryStats.growth, Currency.IDR, {
              compact: true,
            })}
          </Text>
        </Tile>

        <Tile size="sm" className="flex flex-col gap-1">
          <Text fontWeight="medium" fontSize="sm" color="gray">
            Transactions
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {summaryStats.totalTransactions.toLocaleString()}
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
            {summaryStats.peakMonth
              ? formatDate(summaryStats.peakMonth, DateFormat.SHORT_MONTH_YEAR)
              : 'N/A'}
          </Text>
          <Text fontSize="xs" color="gray">
            {formatPrice(summaryStats.highest, Currency.IDR, { compact: true })}
          </Text>
        </Tile>
      </div>
    </>
  );
};

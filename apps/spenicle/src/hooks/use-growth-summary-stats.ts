import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export interface GrowthSummaryStatsOptions {
  metric?: 'net' | 'income' | 'expense' | 'transfer';
}

export interface GrowthSummaryStatsModel {
  amount: number;
  percentage: number;
  formattedPercentage: string;
  trend: 'up' | 'down' | 'neutral';
  TrendIcon: typeof TrendingUpIcon | typeof TrendingDownIcon | typeof MinusIcon;
  getTrendColor: (isExpense: boolean) => 'primary' | 'secondary' | 'gray';
}

const formatGrowthPercentage = (percentage: number) => {
  return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
};

export const useGrowthSummaryStats = (
  data: SummaryTransactionsModel,
  options?: GrowthSummaryStatsOptions,
): GrowthSummaryStatsModel => {
  const { metric = 'net' } = options || {};

  const getValue = (tx: SummaryTransactionsModel[number]) => {
    switch (metric) {
      case 'income':
        return tx.income ?? 0;
      case 'expense':
        return tx.expense ?? 0;
      case 'transfer':
        return tx.transfer ?? 0;
      default:
        return tx.net ?? 0;
    }
  };

  const periods = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((p) => (p.totalTransactions ?? 0) > 0);

  if (!periods.length)
    return {
      amount: 0,
      percentage: 0,
      trend: 'neutral',
      TrendIcon: MinusIcon,
      getTrendColor: () => 'gray',
      formattedPercentage: formatGrowthPercentage(0),
    };

  if (periods.length === 1) {
    const amt = getValue(periods[0]);
    const pct = amt === 0 ? 0 : amt > 0 ? 100 : -100;
    const dir = pct > 0.1 ? 'up' : pct < -0.1 ? 'down' : 'neutral';
    return {
      amount: amt,
      percentage: pct,
      formattedPercentage: formatGrowthPercentage(pct),
      trend: dir,
      TrendIcon: dir === 'up' ? TrendingUpIcon : dir === 'down' ? TrendingDownIcon : MinusIcon,
      getTrendColor: (isExpense: boolean) =>
        dir === 'up'
          ? isExpense
            ? 'primary'
            : 'secondary'
          : dir === 'down'
            ? isExpense
              ? 'secondary'
              : 'primary'
            : 'gray',
    };
  }

  const { totalGrowth, validComparisons, prevSum } = periods.slice(1).reduce(
    (acc, cur, idx) => {
      const prevVal = getValue(periods[idx]);
      const curVal = getValue(cur);
      const periodGrowth = curVal - prevVal;
      acc.totalGrowth += periodGrowth;
      acc.prevSum += prevVal;
      acc.validComparisons += 1;
      return acc;
    },
    { totalGrowth: 0, validComparisons: 0, prevSum: 0 },
  );

  const averagePeriodGrowth = validComparisons ? totalGrowth / validComparisons : 0;

  // Compute percentage so it's consistent with `amount`:
  // use averagePeriodGrowth relative to average previous value.
  const averagePrevValue = validComparisons ? prevSum / validComparisons : 0;

  const averageGrowthPercentage = (() => {
    if (!validComparisons) return 0;
    if (averagePrevValue === 0) {
      if (averagePeriodGrowth === 0) return 0;
      return averagePeriodGrowth > 0 ? 100 : -100;
    }
    return (averagePeriodGrowth / Math.abs(averagePrevValue)) * 100;
  })();
  const trendDirection: 'up' | 'down' | 'neutral' =
    averageGrowthPercentage > 0.1 ? 'up' : averageGrowthPercentage < -0.1 ? 'down' : 'neutral';

  const TrendIcon = useMemo(() => {
    switch (trendDirection) {
      case 'up':
        return TrendingUpIcon;
      case 'down':
        return TrendingDownIcon;
      default:
        return MinusIcon;
    }
  }, [trendDirection]);

  const getTrendColor = useCallback(
    (isExpense: boolean) => {
      switch (trendDirection) {
        case 'up':
          return isExpense ? 'primary' : 'secondary';
        case 'down':
          return isExpense ? 'secondary' : 'primary';
        default:
          return 'gray';
      }
    },
    [trendDirection],
  );

  return {
    amount: averagePeriodGrowth,
    percentage: averageGrowthPercentage,
    trend: trendDirection,
    TrendIcon,
    getTrendColor,
    formattedPercentage: formatGrowthPercentage(averageGrowthPercentage),
  };
};

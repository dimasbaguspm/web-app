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

    // calculate growth (comparing first vs last month)
    const firstValue = values[0] || 0;
    const lastValue = values[values.length - 1] || 0;
    const growth = lastValue - firstValue;
    const growthPercentage = firstValue !== 0 ? (growth / firstValue) * 100 : 0;

    // determine trend direction based on linear regression or simple comparison
    const midPoint = Math.floor(values.length / 2);
    const firstHalf =
      values.slice(0, midPoint).reduce((sum, val) => sum + val, 0) / midPoint;
    const secondHalf =
      values.slice(midPoint).reduce((sum, val) => sum + val, 0) /
      (values.length - midPoint);

    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
    if (secondHalf > firstHalf * 1.05) trendDirection = 'up';
    else if (secondHalf < firstHalf * 0.95) trendDirection = 'down';

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

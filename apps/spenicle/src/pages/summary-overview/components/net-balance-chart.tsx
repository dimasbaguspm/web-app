import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Badge } from '@dimasbaguspm/versaur';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import type { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';

interface NetBalanceChartProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  summaryTransactions: SummaryTransactionsModel;
  isMobile: boolean;
  hasAccountFilter?: boolean;
  frequency?: string;
}
export const NetBalanceChart = ({
  balance,
  totalIncome,
  totalExpense,
  summaryTransactions,
  isMobile,
  hasAccountFilter = false,
  frequency = 'monthly',
}: NetBalanceChartProps) => {
  // Process chart data - with carry over when no filter, without carry over when filtered by specific accounts
  const chartData = useMemo(() => {
    if (!Array.isArray(summaryTransactions) || summaryTransactions.length === 0) return [];

    // Format date label based on frequency (compact for chart display)
    const getDateLabel = (date: string) => {
      const d = dayjs(date);
      switch (frequency) {
        case 'daily':
          return d.format('MMM D');
        case 'weekly': {
          // Show week range: start of week - end of week (compact)
          const weekStart = d.startOf('week');
          const weekEnd = d.endOf('week');
          // If same month, show: "2-8 Jun"
          // If different months, show: "30 May-5 Jun"
          if (weekStart.month() === weekEnd.month()) {
            return `${weekStart.format('D')}-${weekEnd.format('D MMM')}`;
          } else {
            return `${weekStart.format('D MMM')}-${weekEnd.format('D MMM')}`;
          }
        }
        case 'yearly':
          return d.format('YYYY');
        case 'monthly':
        default:
          return d.format('MMM YY');
      }
    };

    const sorted = summaryTransactions
      .map((item) => ({
        month: getDateLabel(item.date),
        income: Math.abs(item.income ?? 0),
        expense: Math.abs(item.expense ?? 0),
        net: item.net ?? 0,
        date: item.date,
      }))
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

    // If no account filter (showing all accounts), build running balance with carry over
    // If specific accounts are selected, show monthly values without carry over
    if (!hasAccountFilter) {
      let carry = 0;
      const withRunningBalance = sorted.map((item) => {
        const runningBalance = carry + (item.net ?? 0);
        carry = runningBalance;
        return { ...item, runningBalance };
      });
      return withRunningBalance;
    } else {
      // Show income and expense per month without carry over
      const withoutCarryOver = sorted.map((item) => ({
        ...item,
        runningBalance: item.net ?? 0, // Use net for the month without accumulation
      }));
      return withoutCarryOver;
    }
  }, [summaryTransactions, hasAccountFilter, frequency]);

  const percentageChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1]?.runningBalance ?? 0;
    const previous = chartData[chartData.length - 2]?.runningBalance ?? 0;
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  }, [chartData]);

  // Get comparison period label based on frequency
  const getComparisonLabel = () => {
    switch (frequency) {
      case 'daily':
        return 'vs last day';
      case 'weekly':
        return 'vs last week';
      case 'yearly':
        return 'vs last year';
      case 'monthly':
      default:
        return 'vs last month';
    }
  };

  return (
    <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-primary-light text-sm font-medium">
            {hasAccountFilter ? 'Selected Accounts Balance' : 'Net Balance'}
          </p>
          <p className="text-3xl font-bold mt-1">{formatPrice(balance)}</p>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <Badge color={percentageChange >= 0 ? 'secondary' : 'primary'} shape="rounded">
              {percentageChange >= 0 ? '+' : ''}
              {percentageChange.toFixed(1)}%
            </Badge>
            <span className="text-primary-light text-xs">{getComparisonLabel()}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className={cx('relative mt-4', isMobile ? 'h-64' : 'h-82')}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: -20,
              bottom: frequency === 'weekly' ? 10 : 5,
            }}
          >
            <defs>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.6)"
              tick={{ fontSize: 10 }}
              angle={frequency === 'daily' || frequency === 'weekly' ? -45 : 0}
              textAnchor={frequency === 'daily' || frequency === 'weekly' ? 'end' : 'middle'}
              height={frequency === 'daily' || frequency === 'weekly' ? 50 : 30}
              interval={frequency === 'daily' ? 'preserveStartEnd' : 0}
            />
            <YAxis
              stroke="rgba(255,255,255,0.6)"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatPrice(value, Currency.IDR, { compact: true, showCurrencySymbol: false })}
            />

            <Area
              type="monotone"
              dataKey="runningBalance"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNet)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
        <div>
          <p className="text-primary-light text-xs">Total Income</p>
          <p className="text-lg font-bold">{formatPrice(totalIncome)}</p>
        </div>
        <div>
          <p className="text-primary-light text-xs">Total Expense</p>
          <p className="text-lg font-bold">{formatPrice(totalExpense)}</p>
        </div>
      </div>
    </div>
  );
};

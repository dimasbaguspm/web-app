import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import type { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';

interface NetBalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  summaryTransactions: SummaryTransactionsModel;
  isMobile?: boolean;
}

export const NetBalanceCard = ({
  balance,
  totalIncome,
  totalExpense,
  summaryTransactions,
  isMobile,
}: NetBalanceCardProps) => {
  // Process chart data - mobile shows last 4 months (current + 3 previous), desktop shows 6 months
  const chartData = useMemo(() => {
    if (!Array.isArray(summaryTransactions) || summaryTransactions.length === 0) return [];

    const sorted = summaryTransactions
      .map((item) => ({
        month: dayjs(item.date).format('MMM'),
        income: Math.abs(item.income ?? 0),
        expense: Math.abs(item.expense ?? 0),
        net: item.net ?? 0,
        date: item.date,
      }))
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

    // On mobile, only show last 4 months (current month + 3 previous)
    return isMobile ? sorted.slice(-4) : sorted;
  }, [summaryTransactions, isMobile]);

  const percentageChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1]?.net ?? 0;
    const previous = chartData[chartData.length - 2]?.net ?? 0;
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  }, [chartData]);

  return (
    <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-primary-light text-sm font-medium">Net Balance</p>
          <p className="text-3xl font-bold mt-1">{formatPrice(balance)}</p>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${percentageChange >= 0 ? 'bg-success bg-opacity-30' : 'bg-danger bg-opacity-30'}`}
            >
              {percentageChange >= 0 ? '+' : ''}
              {percentageChange.toFixed(1)}%
            </span>
            <span className="text-primary-light text-xs">vs last month</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="relative h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="rgba(255,255,255,0.6)"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatPrice(value, Currency.IDR, { compact: true, showCurrencySymbol: false })}
            />

            <Area
              type="monotone"
              dataKey="net"
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

import { SearchSummaryTransactionsModel, SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Heading, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendsChartProps {
  transactions: SummaryTransactionsModel;
  metric: 'net' | 'income' | 'expense';
  frequency: NonNullable<SearchSummaryTransactionsModel['frequency']>;
}

export const TrendsChart: FC<TrendsChartProps> = ({ transactions, metric, frequency }) => {
  const getDataKey = () => {
    return metric;
  };

  const getAreaColor = () => {
    switch (metric) {
      case 'expense':
        return '#e07a5f';
      case 'income':
        return '#81b29a';
      case 'net':
      default:
        return '#84a5c0';
    }
  };

  const getChartTitle = () => {
    switch (frequency) {
      case 'daily':
        return 'Daily Trends';
      case 'weekly':
        return 'Weekly Trends';
      case 'monthly':
        return 'Monthly Trends';
      case 'yearly':
        return 'Yearly Trends';
      default:
        return 'Trends';
    }
  };

  const getXAxisDateFormat = () => {
    switch (frequency) {
      case 'daily':
        return DateFormat.DAY_MONTH; // "15 Jan"
      case 'weekly':
        return DateFormat.DAY_MONTH_YEAR; // "15 Jan 2024"
      case 'monthly':
        return DateFormat.SHORT_MONTH_YEAR; // "Jan 2024"
      case 'yearly':
        return DateFormat.YEAR; // "2024"
      default:
        return DateFormat.SHORT_MONTH_YEAR;
    }
  };

  const getTooltipDateFormat = () => {
    switch (frequency) {
      case 'daily':
        return DateFormat.LONG_DATE; // "January 15, 2024"
      case 'weekly':
        return DateFormat.LONG_DATE; // "January 15, 2024"
      case 'monthly':
        return DateFormat.MONTH_YEAR; // "January 2024"
      case 'yearly':
        return DateFormat.YEAR; // "2024"
      default:
        return DateFormat.MONTH_YEAR;
    }
  };

  return (
    <>
      <div className="mb-4">
        <Heading as="h5">{getChartTitle()}</Heading>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <AreaChart
            data={transactions}
            margin={{
              top: 0,
              right: 0,
              bottom: 20,
              left: -10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              className="text-xs text-border"
              tickFormatter={(value) => {
                return formatDate(value, getXAxisDateFormat());
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs text-border"
              tickFormatter={(value) =>
                formatPrice(value, Currency.IDR, {
                  compact: true,
                  showCurrencySymbol: false,
                })
              }
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-border rounded shadow-lg max-w-48">
                      <Text color="black" as="small">
                        {formatDate((label ?? '').toString(), getTooltipDateFormat())}
                      </Text>
                      <div className="flex flex-col gap-1 mt-1">
                        {payload.map((entry) => (
                          <Text color="gray" as="small" key={entry.name}>
                            {formatPrice(entry.value, Currency.IDR, {
                              compact: true,
                            })}
                          </Text>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey={getDataKey()}
              stroke={getAreaColor()}
              fill={getAreaColor()}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

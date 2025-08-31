import { AccountModel, SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Text } from '@dimasbaguspm/versaur';
import { capitalize } from 'lodash';
import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendsChartProps {
  data: AccountModel;
  transactions: SummaryTransactionsModel;
}

export const TrendsChart: FC<TrendsChartProps> = ({ data, transactions }) => {
  const { isExpense } = formatSpenicleAccount(data);

  const getDataKey = () => {
    if (isExpense) return 'expense';
    return 'income';
  };

  const getAreaColor = () => {
    if (isExpense) return '#e07a5f';
    return '#81b29a';
  };

  return (
    <>
      <div className="mb-4">
        <Text fontWeight="medium" fontSize="lg" color="black">
          Monthly trends
        </Text>
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
                return formatDate(value, DateFormat.SHORT_MONTH_YEAR);
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
                      <Text color="black" fontSize="sm">
                        {formatDate((label ?? '').toString(), DateFormat.MONTH_YEAR)}
                      </Text>
                      <div className="flex flex-col gap-1 mt-1">
                        {payload.map((entry) => (
                          <Text color="gray" fontSize="xs" key={entry.name}>
                            {capitalize(entry.name)}:{' '}
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

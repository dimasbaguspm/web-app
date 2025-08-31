import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Text } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { FC } from 'react';
import { Area, AreaChart, Brush, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { SummaryFrequencyType, useSummaryFilter } from '../../summary/hooks/use-summary-filter';

interface DateTransactionsAreaChartProps {
  data: SummaryTransactionsModel;
}

export const DateTransactionsAreaChart: FC<DateTransactionsAreaChartProps> = ({ data }) => {
  const { frequency } = useSummaryFilter();

  const xAxisDateFormat =
    frequency === SummaryFrequencyType.allTheTime
      ? DateFormat.YEAR
      : frequency === SummaryFrequencyType.thisYear
        ? DateFormat.MONTH
        : DateFormat.COMPACT_DATE;

  const tooltipDateFormat =
    frequency === SummaryFrequencyType.allTheTime
      ? DateFormat.YEAR
      : frequency === SummaryFrequencyType.thisYear
        ? DateFormat.MONTH
        : DateFormat.FULL_DATE;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -20,
            bottom: 35,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={20}
            tickFormatter={(value) => formatDate(value, xAxisDateFormat)}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            width={60}
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
                      {formatDate(dayjs(label), tooltipDateFormat)}
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
            dataKey="income"
            stackId="1"
            stroke="#81b29a"
            fill="#81b29a"
            fillOpacity={0.3}
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="expense"
            stackId="2"
            stroke="#e07a5f"
            fill="#e07a5f"
            fillOpacity={0.3}
          />

          <Brush
            dataKey="date"
            height={40}
            stroke="#84a5c0"
            fill="#ffffff"
            alwaysShowText={false}
            tickFormatter={(value) => {
              return formatDate(value, DateFormat.COMPACT_DATE);
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

import { SummaryTotalTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { NoResults, Text } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface Props {
  data: SummaryTotalTransactionsModel;
}

export const OverviewChart: FC<Props> = ({ data }) => {
  const hasData = data.totalTransactions !== 0;
  const isSurplus = data.income - data.expense >= 0;

  const pieChartData = useMemo(() => {
    if (!data) return [];

    const expenseAbs = Math.abs(data.expense);
    const incomeAbs = Math.abs(data.income);

    if (expenseAbs === 0 && incomeAbs === 0) return [];

    return [
      {
        name: 'Expense',
        value: expenseAbs,
        color: '#e07a5f',
        label: `Expense (${formatPrice(expenseAbs)})`,
      },
      {
        name: 'Income',
        value: incomeAbs,
        color: '#81b29a',
        label: `Income (${formatPrice(incomeAbs)})`,
      },
    ];
  }, [data]);

  return (
    <div>
      <If condition={hasData}>
        <div className="h-60 relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                isAnimationActive={false}
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Text
              fontSize="xs"
              color="gray"
              align="center"
              className="text-center mb-1"
            >
              Net Balance
            </Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              align="center"
              color={isSurplus ? 'secondary' : 'primary'}
            >
              {formatPrice(data.income - data.expense)}
            </Text>
            <Text fontSize="xs" color="gray" className="text-center mt-1">
              {data.totalTransactions} transactions
            </Text>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <Text fontSize="sm">
              Expense: {formatPrice(Math.abs(data?.expense || 0))}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-full" />
            <Text fontSize="sm">Income: {formatPrice(data?.income || 0)}</Text>
          </div>
        </div>
      </If>

      <If condition={!hasData}>
        <NoResults
          icon={SearchXIcon}
          title="No Data Available"
          subtitle="Please check your filters or try a different date range."
        />
      </If>
    </div>
  );
};

import { SummaryAccountsModel } from '@dimasbaguspm/interfaces';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { ButtonIcon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

interface AccountsIncomeChartProps {
  data: SummaryAccountsModel;
  order: 'asc' | 'desc';
  onReorderClick?: () => void;
}

export const AccountsIncomeChart: FC<AccountsIncomeChartProps> = ({
  data,
  order,
  onReorderClick,
}) => {
  const chartData = useMemo(() => {
    return data
      .sort((a, b) =>
        order === 'desc' ? b.income - a.income : a.income - b.income,
      )
      .slice(0, 10)
      .map((item) => ({
        name:
          item.accountName.length > 15
            ? `${item.accountName.substring(0, 15)}...`
            : item.accountName,
        fullName: item.accountName,
        value: Math.abs(item.income),
        transactions: item.totalTransactions,
      }));
  }, [data, order]);

  return (
    <Tile>
      <div className="flex flex-row justify-between items-center mb-4">
        <Text as="h5" fontWeight="medium">
          Top 10 Income Accounts
        </Text>
        <ButtonIcon
          aria-label={`Sort ${order === 'desc' ? 'ascending' : 'descending'}`}
          as={order === 'desc' ? ArrowDownIcon : ArrowUpIcon}
          variant="ghost"
          size="sm"
          onClick={onReorderClick}
        />
      </div>

      <div className="space-y-2 overflow-y-auto">
        {chartData.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex items-center">
              <Text color="gray" fontSize="base" fontWeight="semibold">
                {index + 1}
              </Text>
              <Text
                fontSize="base"
                fontWeight="semibold"
                className="truncate ml-4"
              >
                {item.fullName}
              </Text>
              <Text fontSize="xs" color="gray" className="ml-1">
                ({item.transactions} txns)
              </Text>
            </div>
            <div className="text-right">
              <Text fontSize="base" fontWeight="medium" color="secondary">
                {formatPrice(item.value)}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
};

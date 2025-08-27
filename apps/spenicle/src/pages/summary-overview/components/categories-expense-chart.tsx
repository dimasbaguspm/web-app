import { SummaryCategoriesModel } from '@dimasbaguspm/interfaces';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { ButtonIcon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

interface CategoriesExpenseChartProps {
  data: SummaryCategoriesModel;
  order: 'asc' | 'desc';
  onReorderClick?: () => void;
}

export const CategoriesExpenseChart: FC<CategoriesExpenseChartProps> = ({
  data,
  order,
  onReorderClick,
}) => {
  const spendingChartData = useMemo(() => {
    return data
      .sort((a, b) =>
        order === 'desc' ? b.expense - a.expense : a.expense - b.expense,
      )
      .slice(0, 10)
      .map((item) => ({
        name:
          item.categoryName.length > 15
            ? `${item.categoryName.substring(0, 15)}...`
            : item.categoryName,
        fullName: item.categoryName,
        value: Math.abs(item.expense),
        transactions: item.totalTransactions,
      }));
  }, [data, order]);

  return (
    <Tile>
      <div className="flex flex-row justify-between items-center mb-4">
        <Text as="h5" fontWeight="medium">
          Top 10 Expense Categories
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
        {spendingChartData.slice(0, 10).map((item, index) => (
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
              <Text fontSize="base" fontWeight="medium" color="primary">
                {formatPrice(item.value)}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
};

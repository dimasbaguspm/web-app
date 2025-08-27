import { SummaryCategoriesModel } from '@dimasbaguspm/interfaces';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { ButtonIcon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

interface CategoriesIncomeChartProps {
  data: SummaryCategoriesModel;
  order: 'asc' | 'desc';
  onReorderClick?: () => void;
}

export const CategoriesIncomeChart: FC<CategoriesIncomeChartProps> = ({
  data,
  order,
  onReorderClick,
}) => {
  const incomeChartData = useMemo(() => {
    return data
      .sort((a, b) =>
        order === 'desc' ? b.income - a.income : a.income - b.income,
      )
      .slice(0, 10)
      .map((item) => ({
        name:
          item.categoryName.length > 15
            ? `${item.categoryName.substring(0, 15)}...`
            : item.categoryName,
        fullName: item.categoryName,
        value: Math.abs(item.income),
        transactions: item.totalTransactions,
      }));
  }, [data, order]);

  return (
    <Tile>
      <div className="flex flex-row justify-between items-center mb-4">
        <Text as="h5" fontWeight="medium">
          Top 10 Income Categories
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
        {incomeChartData.slice(0, 10).map((item, index) => (
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

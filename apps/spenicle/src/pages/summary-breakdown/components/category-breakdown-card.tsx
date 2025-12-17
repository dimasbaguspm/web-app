import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Card, Heading, Hr, Text } from '@dimasbaguspm/versaur';
import { useMemo } from 'react';

import { CategoryCard } from '../../../components/category-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface CategoryData {
  categoryId: number;
  categoryName: string;
  expense?: number;
  income?: number;
}

interface CategoryBreakdownCardProps {
  data: CategoryData[];
  type: 'expense' | 'income';
  total: number;
}

// Using colors from the Versaur design system with extended palette
const COLORS = [
  '#e07a5f', // primary
  '#81b29a', // secondary
  '#84a5c0', // tertiary
  '#6db285', // success
  '#e08a47', // warning
  '#6b8fad', // info
  '#e06650', // danger
  '#3d405b', // ghost
  '#f4f1de', // cream
  '#a95a3a', // primary-bold
  '#56806b', // secondary-bold
  '#5a7a99', // tertiary-bold
];

export const CategoryBreakdownCard = ({ data, type, total }: CategoryBreakdownCardProps) => {
  const { openDrawer } = useDrawerRoute();

  const handleCategoryClick = (category: CategoryModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, { categoryId: category.id });
  };

  const processedData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        categories: [],
        others: null,
      };
    }

    const sortedData = [...data]
      .map((item) => ({
        id: item.categoryId,
        name: item.categoryName,
        value: Math.abs((type === 'expense' ? item.expense : item.income) ?? 0),
        rawData: item,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Dynamically determine how many categories to show
    // Others should not exceed 10% of total
    let topCount = sortedData.length;
    let othersTotal = 0;

    // Find the optimal split point where "Others" <= 10%
    for (let i = 1; i < sortedData.length; i++) {
      const remaining = sortedData.slice(i);
      const remainingTotal = remaining.reduce((sum, item) => sum + item.value, 0);
      const percentage = (remainingTotal / total) * 100;

      if (percentage <= 10) {
        topCount = i;
        othersTotal = remainingTotal;
        break;
      }
    }

    // If we have categories to combine into "Others"
    if (topCount < sortedData.length && othersTotal > 0) {
      const topCategories = sortedData.slice(0, topCount);

      return {
        categories: topCategories,
        others: {
          id: 'others',
          name: 'Others',
          value: othersTotal,
        },
      };
    }

    return {
      categories: sortedData,
      others: null,
    };
  }, [data, type]);

  const allCategories = [...processedData.categories];
  if (processedData.others) {
    allCategories.push({
      ...processedData.others,
      id: -1,
      rawData: { categoryId: -1, categoryName: 'Others' },
    });
  }

  if (allCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <Heading level={4} className="mb-4 capitalize">
          {type === 'expense' ? 'Expenses' : 'Income'}
        </Heading>
        <Text color="gray" className="text-center py-8">
          No {type} data available
        </Text>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Heading level={4} className="capitalize">
          {type === 'expense' ? 'Expenses' : 'Income'}
        </Heading>
        <div className="text-right">
          <Text fontSize="xl" fontWeight="bold">
            {formatPrice(total)}
          </Text>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="mb-4">
        <Text fontSize="sm" color="gray" className="mb-2">
          Allocation
        </Text>
        <div className="flex h-2 rounded-full overflow-hidden">
          {allCategories.map((item, index) => (
            <div
              key={item.id}
              style={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
          ))}
        </div>
      </div>

      {/* Category List */}
      <ul>
        {processedData.categories.map(
          (item: { id: number; name: string; value: number; rawData: CategoryData }, index: number) => {
            const isLastItem = index === processedData.categories.length - 1;
            const percentage = (item.value / total) * 100;
            const spent = item.value;

            // Create a mock CategoryModel for CategoryCard
            const categoryModel: Partial<CategoryModel> = {
              id: item.id,
              name: item.name,
              type: type === 'expense' ? 'expense' : 'income',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            return (
              <li key={item.id}>
                <div className="relative flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <CategoryCard
                      category={categoryModel as CategoryModel}
                      onClick={() => handleCategoryClick(categoryModel as CategoryModel)}
                      hideGroup
                      hideType
                      supplementaryInfo={`${formatPrice(spent)} (${percentage.toFixed(1)}%)`}
                    />
                  </div>
                </div>
                {!isLastItem && <Hr />}
              </li>
            );
          },
        )}

        {/* Others Category */}
        {processedData.others && (
          <div className="relative flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[4 % COLORS.length] }}
            />
            <Card
              title="Another Categories"
              as="div"
              avatar={<Avatar shape="rounded">AC</Avatar>}
              supplementaryInfo={`${formatPrice(processedData.others.value)} (${(
                (processedData.others.value / total) *
                100
              ).toFixed(1)}%)`}
            />
          </div>
        )}
      </ul>
    </div>
  );
};

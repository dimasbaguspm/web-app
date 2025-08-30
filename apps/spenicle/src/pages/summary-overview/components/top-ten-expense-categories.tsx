import {
  useApiSpenicleCachedCategories,
  useApiSpenicleCategoriesPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { SummaryCategoriesModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Card, NoResults, Text } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface TopTenExpenseCategoriesProps {
  data: SummaryCategoriesModel;
}

export const TopTenExpenseCategories: FC<TopTenExpenseCategoriesProps> = ({
  data,
}) => {
  const { openDrawer } = useDrawerRoute();
  const sortedData = data
    .filter((item) => item.expense > 0)
    .sort((a, b) => b.expense - a.expense)
    .slice(0, 10);

  const cachedCategories = useApiSpenicleCachedCategories();

  const shouldFetchIds = sortedData
    .map((item) => item.categoryId)
    .filter((id) => !cachedCategories.find((cat) => cat.id === id));

  useApiSpenicleCategoriesPaginatedQuery(
    {
      id: shouldFetchIds,
    },
    {
      enabled: Boolean(shouldFetchIds.length),
    },
  );

  const organizedData = sortedData.map((item) => ({
    ...item,
    category: cachedCategories.find((cat) => cat.id === item.categoryId),
  }));

  const handleOnCategoryClick = (categoryId: number) => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, { categoryId });
  };

  return (
    <div className="flex flex-col gap-1">
      <Text fontWeight="semibold" fontSize="lg" className="mb-4">
        Top Expense Categories
      </Text>
      <If condition={organizedData.length}>
        <ul className="flex flex-col ml-6 list-decimal">
          {organizedData.map((item) => {
            const { initialName, name } = formatSpenicleCategory(item.category);
            return (
              <li key={item.categoryId} className="border-b border-border">
                <Card
                  onClick={() => handleOnCategoryClick(item.category?.id ?? 0)}
                  title={name}
                  subtitle={
                    <Text
                      fontWeight="normal"
                      color="gray"
                      fontSize="sm"
                      className="flex-grow"
                      align="right"
                    >
                      {formatPrice(item.expense)}
                    </Text>
                  }
                  avatar={
                    <Avatar shape="rounded" size="lg">
                      {initialName}
                    </Avatar>
                  }
                />
              </li>
            );
          })}
        </ul>
      </If>
      <If condition={organizedData.length === 0}>
        <NoResults icon={SearchXIcon} title="No categories found" />
      </If>
    </div>
  );
};

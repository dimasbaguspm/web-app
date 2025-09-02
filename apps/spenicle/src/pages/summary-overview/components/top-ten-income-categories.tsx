import { useApiSpenicleCachedCategories, useApiSpenicleCategoriesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { SummaryCategoriesModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Accordion, Avatar, Card, Hr, NoResults } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface TopTenIncomeCategoriesProps {
  data: SummaryCategoriesModel;
}

export const TopTenIncomeCategories: FC<TopTenIncomeCategoriesProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const sortedData = data
    .filter((item) => item.income > 0)
    .sort((a, b) => b.income - a.income)
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
      <Accordion title={<Accordion.Title>Top Income Categories ({organizedData.length})</Accordion.Title>}>
        <If condition={organizedData.length}>
          <ul className="flex flex-col ml-6 list-decimal">
            {organizedData.map((item, index) => {
              const { initialName, name } = formatSpenicleCategory(item.category);
              const isLastItem = index === organizedData.length - 1;
              return (
                <li key={item.categoryId}>
                  <Card
                    onClick={() => handleOnCategoryClick(item.category?.id ?? 0)}
                    title={name}
                    subtitle={
                      <Card.List>
                        <Card.ListItem>{formatPrice(item.income)}</Card.ListItem>
                      </Card.List>
                    }
                    avatar={<Avatar shape="rounded">{initialName}</Avatar>}
                  />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>
        </If>
        <If condition={organizedData.length === 0}>
          <NoResults icon={SearchXIcon} title="No categories found" />
        </If>
      </Accordion>
    </div>
  );
};

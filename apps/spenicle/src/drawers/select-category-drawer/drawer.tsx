import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  FormLayout,
  NoResults,
  PageLoader,
  SearchInput,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { CategoryCard } from '../../components/category-card';
import { CategoryFiltersControl } from '../../components/category-filter-control';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { useCategoryFilter } from '../../hooks/use-category-filter';

interface SelectCategoryDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payloadId: string;
  payload: Record<string, unknown>;
}

export const SelectCategoryDrawer: FC<SelectCategoryDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    typeof payload?.[payloadId] === 'number' ? payload[payloadId] : null,
  );

  const categoryFilters = useCategoryFilter({ adapter: 'state' });
  const [searchValue, setSearchValue] = useDebouncedState({ defaultValue: '' });

  const [categories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      search: searchValue,
      categoryGroupIds: categoryFilters.appliedFilters.groupId,
      type: ['expense', 'income', 'transfer'].includes(payload.type as string)
        ? [payload.type as 'expense' | 'income' | 'transfer']
        : undefined,
      sortBy: 'name',
      sortOrder: 'asc',
      pageSize: 15,
    });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedCategoryId,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Category</Drawer.Title>
        <ButtonIcon as={XIcon} size="sm" variant="ghost" aria-label="Close" onClick={handleOnCancel} />
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput defaultValue={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </FormLayout.Column>
          <FormLayout.Column span={12}>
            <CategoryFiltersControl config={categoryFilters} hideTypeFilter />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, categories.length]}>
          <ul className="mb-4">
            {categories.map((category) => {
              return (
                <li key={category.id}>
                  <SelectableSingleInput
                    label={<CategoryCard as="div" size="none" category={category} />}
                    value={category.id.toString()}
                    checked={category.id === selectedCategoryId}
                    onChange={() => setSelectedCategoryId(category.id)}
                  />
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!categories?.length, !isInitialFetching]}>
          <NoResults
            icon={SearchXIcon}
            title="No categories found"
            subtitle="Try adjusting your search criteria, or create a new category."
            action={
              <ButtonGroup>
                <Button variant="outline" onClick={() => openDrawer(DRAWER_ROUTES.NEW_CATEGORY)}>
                  Create Category
                </Button>
              </ButtonGroup>
            }
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-category-form" onClick={handleOnSubmit} disabled={!selectedCategoryId}>
            Select
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

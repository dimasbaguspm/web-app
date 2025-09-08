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
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { CategoryCard } from '../../components/category-card';
import { CategoryFiltersControl } from '../../components/category-filter-control';
import { useCategoryFilter } from '../../hooks/use-category-filter';

interface SelectMultipleCategoryDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payloadId: string;
  payload: Record<string, unknown>;
}

export const SelectMultipleCategoryDrawer: FC<SelectMultipleCategoryDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    typeof payload?.[payloadId] === 'number'
      ? [payload[payloadId]]
      : Array.isArray(payload?.[payloadId])
        ? payload[payloadId]
        : [],
  );

  const [searchValue, setSearchValue] = useDebouncedState({ defaultValue: '' });
  const categoryFilters = useCategoryFilter({ adapter: 'state' });

  const [categories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      search: searchValue,
      type: categoryFilters.appliedFilters.type,
      categoryGroupIds: categoryFilters.appliedFilters.groupId,
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
          [payloadId]: selectedCategoryIds,
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
            <CategoryFiltersControl config={categoryFilters} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>

        <If condition={[categories?.length, !isInitialFetching]}>
          <ul className="mb-4">
            <li>
              <SelectableMultipleInput
                label="Select All Visible"
                checked={selectedCategoryIds.length === categories.length && selectedCategoryIds.length > 0}
                value="all"
                onChange={() => {
                  if (selectedCategoryIds.length === categories.length) {
                    setSelectedCategoryIds([]);
                  } else {
                    setSelectedCategoryIds(categories.map((category) => category.id));
                  }
                }}
              />
            </li>

            {categories?.map((category) => {
              return (
                <li key={category.id}>
                  <SelectableMultipleInput
                    label={<CategoryCard as="div" size="none" category={category} />}
                    value={category.id.toString()}
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                      } else {
                        setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== category.id));
                      }
                    }}
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
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-category-form" onClick={handleOnSubmit}>
            Select
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

import {
  useApiSpenicleCategoriesInfiniteQuery,
  useApiSpenicleCategoryGroupsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonMenu,
  Card,
  Drawer,
  FormLayout,
  Icon,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { FC, useState } from 'react';

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
  const [selectGroupId, setSelectGroupId] = useDebouncedState<number[]>({ defaultValue: [], debounceTime: 100 });

  const [categories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      search: searchValue,
      type: ['expense', 'income', 'transfer'].includes(payload.type as string)
        ? [payload.type as 'expense' | 'income' | 'transfer']
        : undefined,
      categoryGroupIds: selectGroupId ? selectGroupId : undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    });

  const [categoryGroups] = useApiSpenicleCategoryGroupsInfiniteQuery({
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
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput defaultValue={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </FormLayout.Column>
          <FormLayout.Column span={12}>
            <ButtonGroup>
              <If condition={categoryGroups?.length}>
                <ButtonMenu
                  variant="outline"
                  preserve
                  label={
                    <>
                      <Icon as={SlidersHorizontalIcon} color="inherit" size="sm" />
                      Group
                    </>
                  }
                >
                  {categoryGroups?.map((group) => (
                    <ButtonMenu.Item
                      key={group.id}
                      active={selectGroupId?.includes(group.id)}
                      onClick={() => {
                        if (selectGroupId?.includes(group.id)) {
                          setSelectGroupId(selectGroupId.filter((id) => id !== group.id));
                        } else {
                          setSelectGroupId([...selectGroupId, group.id]);
                        }
                      }}
                    >
                      {group.name}
                    </ButtonMenu.Item>
                  ))}
                </ButtonMenu>
              </If>
            </ButtonGroup>
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[categories?.length, !isInitialFetching]}>
          <ul>
            {categories?.map((category) => {
              const { variant, type, hasGroup, groups } = formatSpenicleCategory(category);
              return (
                <li key={category.id}>
                  <SelectableMultipleInput
                    label={
                      <Card
                        className="p-0"
                        title={category.name}
                        badge={
                          <BadgeGroup>
                            <Badge color={variant} size="sm">
                              {type}
                            </Badge>
                            <If condition={hasGroup}>
                              {groups.map(({ name }) => (
                                <Badge key={name} color="info" size="sm">
                                  {name}
                                </Badge>
                              ))}
                            </If>
                          </BadgeGroup>
                        }
                      />
                    }
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
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

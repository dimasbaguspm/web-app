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
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

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

  const [searchValue, setSearchValue] = useDebouncedState({ defaultValue: '' });
  const [selectGroupId, setSelectGroupId] = useDebouncedState<number[]>({ defaultValue: [], debounceTime: 100 });

  const [categories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      search: searchValue,
      categoryGroupIds: selectGroupId ? selectGroupId : undefined,
      type: ['expense', 'income', 'transfer'].includes(payload.type as string)
        ? [payload.type as 'expense' | 'income' | 'transfer']
        : undefined,
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

        <If condition={[!isInitialFetching, categories.length]}>
          <ul>
            {categories.map((category) => {
              const { variant, type, hasGroup, groups } = formatSpenicleCategory(category);
              return (
                <li key={category.id}>
                  <SelectableSingleInput
                    label={
                      <Card
                        as="div"
                        size="xs"
                        title={category.name}
                        badge={
                          <BadgeGroup>
                            <Badge color={variant} size="sm">
                              {type}
                            </Badge>
                            <If condition={hasGroup}>
                              {groups.map(({ name }) => (
                                <Badge key={name} color="accent_1" size="sm">
                                  {name}
                                </Badge>
                              ))}
                            </If>
                          </BadgeGroup>
                        }
                      />
                    }
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
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

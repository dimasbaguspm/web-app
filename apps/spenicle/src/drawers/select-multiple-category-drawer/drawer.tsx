import { useApiSpenicleCategoriesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { debounce } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface SelectMultipleCategoryDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payloadId: string;
  payload: Record<string, unknown>;
}

export const SelectMultipleCategoryDrawer: FC<
  SelectMultipleCategoryDrawerProps
> = ({ returnToDrawer, returnToDrawerId = null, payloadId, payload }) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    typeof payload?.[payloadId] === 'number'
      ? [payload[payloadId]]
      : Array.isArray(payload?.[payloadId])
        ? payload[payloadId]
        : [],
  );

  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), 1000),
    [],
  );
  const [categories, , { isFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      search: searchValue,
      type: ['expense', 'income', 'transfer'].includes(payload.type as string)
        ? [payload.type as 'expense' | 'income' | 'transfer']
        : undefined,
    },
  );

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
            <SearchInput
              defaultValue={searchValue}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isFetching]}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[categories?.items.length, !isFetching]}>
          <ul>
            {categories?.items.map((category) => {
              const { variant, type } = formatSpenicleCategory(category);
              return (
                <li key={category.id}>
                  <SelectableMultipleInput
                    label={
                      <div className="flex flex-col w-auto">
                        <Text
                          className="mb-2"
                          fontSize="base"
                          fontWeight="semibold"
                        >
                          {category.name}
                        </Text>
                        <BadgeGroup>
                          <Badge color={variant} size="sm">
                            {type}
                          </Badge>
                        </BadgeGroup>
                      </div>
                    }
                    value={category.id.toString()}
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategoryIds([
                          ...selectedCategoryIds,
                          category.id,
                        ]);
                      } else {
                        setSelectedCategoryIds(
                          selectedCategoryIds.filter(
                            (id) => id !== category.id,
                          ),
                        );
                      }
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </If>

        <If condition={[!categories?.items.length, !isFetching]}>
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

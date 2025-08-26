import { useApiSpenicleCategoriesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableSingleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { debounce } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

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
    null,
  );

  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), 1000),
    [],
  );
  const [categories, , { isFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      search: searchValue,
    },
  );

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
            {categories?.items.map((category) => (
              <li key={category.id}>
                <SelectableSingleInput
                  label={
                    <Text fontSize="base" fontWeight="semibold">
                      {category.name}
                    </Text>
                  }
                  value={category.id.toString()}
                  checked={category.id === selectedCategoryId}
                  onChange={() => setSelectedCategoryId(category.id)}
                />
              </li>
            ))}
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
          <Button
            form="select-category-form"
            onClick={handleOnSubmit}
            disabled={!selectedCategoryId}
          >
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

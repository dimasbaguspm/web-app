import { useApiSpenicleCategoriesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
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
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const { openDrawer } = useDrawerRoute();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const { register, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  const [categories, , { isFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      name: [watch('search')],
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
            <SearchInput {...register('search')} />
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
                  label={<span>{category.name}</span>}
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
        <ButtonGroup alignment="end">
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

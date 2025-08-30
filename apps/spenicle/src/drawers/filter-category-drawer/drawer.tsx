import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  ChipMultipleInput,
  Drawer,
  FormLayout,
  Icon,
  TextInput,
} from '@dimasbaguspm/versaur';
import {
  TrendingDownIcon,
  TrendingUpDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useCategoryFilter } from '../../pages/categories/hooks/use-category-filter';

import { FilterCategoryFormSchema } from './types';

export const FilterCategoryDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { appliedFilters, setFilters } = useCategoryFilter();

  const { control, handleSubmit } = useForm<FilterCategoryFormSchema>({
    defaultValues: {
      search: appliedFilters.q,
      type: appliedFilters.type ?? [],
    },
  });

  const handleOnValidSubmit: SubmitHandler<FilterCategoryFormSchema> = (
    data,
  ) => {
    const { search, type } = data ?? {};

    setFilters({
      q: search,
      type: type?.length ? type : undefined,
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Filter</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <form
          id="filter-category-form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
        >
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    variant="primary"
                    label="Search"
                    placeholder="Search categories..."
                  />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ChipMultipleInput {...field} variant="primary" label="Type">
                    <ChipMultipleInput.Option value="expense">
                      <Icon as={TrendingDownIcon} color="inherit" />
                      Expense
                    </ChipMultipleInput.Option>
                    <ChipMultipleInput.Option value="income">
                      <Icon as={TrendingUpIcon} color="inherit" />
                      Income
                    </ChipMultipleInput.Option>
                    <ChipMultipleInput.Option value="transfer">
                      <Icon as={TrendingUpDownIcon} color="inherit" />
                      Transfer
                    </ChipMultipleInput.Option>
                  </ChipMultipleInput>
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="filter-category-form" variant="primary">
            Apply
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

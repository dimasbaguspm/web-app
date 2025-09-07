import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { FilterCategoryFormSchema } from './types';

export const FilterCategoryDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();

  const [search, setSearch] = useDebouncedState<string>();

  const { control, handleSubmit } = useForm<FilterCategoryFormSchema>({
    defaultValues: {
      search,
    },
  });

  const handleOnValidSubmit: SubmitHandler<FilterCategoryFormSchema> = (data) => {
    const { search } = data ?? {};

    setSearch(search ?? '');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Filter</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <form id="filter-category-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} variant="primary" label="Search" placeholder="Search categories..." />
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

import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { SearchAccountsModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, ChipSingleInput, Drawer, FormLayout, Icon, TextInput } from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useAccountFilter } from '../../pages/accounts/hooks/use-account-filter';

export const FilterAccountDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { appliedFilters, setFilters } = useAccountFilter();

  const { control, handleSubmit } = useForm<Partial<NonNullable<SearchAccountsModel>>>({
    defaultValues: {
      search: appliedFilters.q,
      type: appliedFilters.type ?? [],
    },
  });

  const handleOnValidSubmit: SubmitHandler<NonNullable<SearchAccountsModel>> = (data) => {
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
        <form id="filter-account-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <TextInput {...field} variant="primary" label="Search" placeholder="Search accounts..." />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ChipSingleInput
                    {...field}
                    value={field.value?.length === 0 ? '' : field.value?.includes('expense') ? 'expense' : 'income'}
                    variant="primary"
                    label="Type"
                  >
                    <ChipSingleInput.Option value="">All</ChipSingleInput.Option>
                    <ChipSingleInput.Option value="expense">
                      <Icon as={TrendingDownIcon} color="inherit" />
                      Expense
                    </ChipSingleInput.Option>
                    <ChipSingleInput.Option value="income">
                      <Icon as={TrendingUpIcon} color="inherit" />
                      Income
                    </ChipSingleInput.Option>
                  </ChipSingleInput>
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
          <Button type="submit" form="filter-account-form" variant="primary">
            Apply
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

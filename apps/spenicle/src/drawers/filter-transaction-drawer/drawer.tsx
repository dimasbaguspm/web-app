import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, FormLayout, PageLoader, TextInputAsButton } from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { useTransactionFilter } from '../../hooks/use-transaction-filter';

import { TransactionFilterFormSchema } from './types';

interface FilterTransactionDrawerProps {
  payload?: Record<string, unknown>;
}

export const FilterTransactionDrawer: FC<FilterTransactionDrawerProps> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer, openDrawer } = useDrawerRoute();

  const { appliedFilters, filters } = useTransactionFilter({ adapter: 'url' });

  const { control, handleSubmit, watch } = useForm<TransactionFilterFormSchema>({
    defaultValues: {
      accountId: (payload?.accountId as number[]) ?? appliedFilters?.accountId ?? [],
      categoryId: (payload?.categoryId as number[]) ?? appliedFilters?.categoryId ?? [],
    },
  });

  const [accountId, categoryId] = watch(['accountId', 'categoryId']);

  const [accounts, , { isLoading: isAccountsFetching }] = useApiSpenicleAccountsPaginatedQuery(
    {
      id: accountId,
      pageSize: 100,
    },
    {
      enabled: accountId.length > 0,
    },
  );

  const [categories, , { isLoading: isCategoriesFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      id: categoryId,
      pageSize: 100,
    },
    {
      enabled: categoryId.length > 0,
    },
  );

  const handleOnValidSubmit: SubmitHandler<TransactionFilterFormSchema> = (data) => {
    const { categoryId, accountId } = data ?? {};

    filters.replaceAll({
      type: appliedFilters.type,
      accountId,
      categoryId,
    });
  };

  const handleOnAccountClick = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_MULTIPLE_ACCOUNT,
      {
        payloadId: 'accountId',
      },
      {
        replace: true,
        state: {
          payload: watch(),
          returnToDrawer: DRAWER_ROUTES.FILTER_TRANSACTION,
        },
      },
    );
  };

  const handleOnCategoryClick = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_MULTIPLE_CATEGORY,
      {
        payloadId: 'categoryId',
      },
      {
        replace: true,
        state: {
          payload: watch(),
          returnToDrawer: DRAWER_ROUTES.FILTER_TRANSACTION,
        },
      },
    );
  };

  const isLoading = isAccountsFetching || isCategoriesFetching;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Filter Transactions</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isLoading]}>
        <PageLoader />
      </If>
      <If condition={[!isLoading]}>
        <Drawer.Body>
          <form id="filter-transaction-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
            <FormLayout>
              <FormLayout.Column span={12}>
                <Controller
                  name="accountId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInputAsButton
                      label="Accounts"
                      placeholder="Select Accounts"
                      displayValue={field.value ? accounts?.items?.map((acc) => acc.name).join(', ') : ''}
                      onChange={noop}
                      onClick={handleOnAccountClick}
                      error={fieldState.error?.message}
                      value={field.value}
                    />
                  )}
                />
              </FormLayout.Column>

              <FormLayout.Column span={12}>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInputAsButton
                        label="Categories"
                        placeholder="Select Categories"
                        displayValue={field.value ? categories?.items?.map((cat) => cat.name).join(', ') : ''}
                        onChange={noop}
                        value={field.value}
                        onClick={handleOnCategoryClick}
                        error={fieldState.error?.message}
                      />
                    </>
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
            <Button type="submit" form="filter-transaction-form" variant="primary">
              Apply
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};

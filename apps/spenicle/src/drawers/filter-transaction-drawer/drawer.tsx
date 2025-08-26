import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  SegmentSingleInput,
  SelectInput,
} from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  TransactionFilterModel,
  useTransactionsFilter,
} from '../../pages/transactions/hooks/use-transactions-filter';

export const FilterTransactionDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, setFilters } = useTransactionsFilter();
  const { closeDrawer } = useDrawerRoute();

  const [accounts, , { isFetching: isAccountsFetching }] =
    useApiSpenicleAccountsPaginatedQuery({
      pageSize: 100,
    });

  const [categories, , { isFetching: isCategoriesFetching }] =
    useApiSpenicleCategoriesPaginatedQuery({
      pageSize: 100,
    });

  const { control, handleSubmit } = useForm<TransactionFilterModel>({
    defaultValues: {
      accountId: appliedFilters?.accountId ?? '',
      categoryId: appliedFilters?.categoryId ?? '',
      type: appliedFilters?.type ?? '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<TransactionFilterModel> = (data) => {
    setFilters({
      accountId: data.accountId ? Number(data.accountId) : undefined,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      type: data.type ? data.type : undefined,
    });
  };

  const isLoading = isAccountsFetching || isCategoriesFetching;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Filter Transactions</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isLoading]}>
        <LoadingIndicator type="bar" size="sm" />
      </If>
      <If condition={[!isLoading]}>
        <Drawer.Body>
          <form
            id="filter-transaction-form"
            onSubmit={handleSubmit(handleOnValidSubmit)}
          >
            <FormLayout>
              <FormLayout.Column span={12}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, formState }) => (
                    <SegmentSingleInput
                      {...field}
                      label="Type"
                      placeholder="Select a type"
                      size="sm"
                      error={formState.errors.type?.message}
                    >
                      <SegmentSingleInput.Option value="">
                        None
                      </SegmentSingleInput.Option>
                      <SegmentSingleInput.Option value="expense">
                        Expense
                      </SegmentSingleInput.Option>
                      <SegmentSingleInput.Option value="income">
                        Income
                      </SegmentSingleInput.Option>
                      <SegmentSingleInput.Option value="transfer">
                        Transfer
                      </SegmentSingleInput.Option>
                    </SegmentSingleInput>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="accountId"
                  control={control}
                  render={({ field, formState }) => (
                    <SelectInput
                      {...field}
                      label="Account"
                      error={formState.errors.accountId?.message}
                    >
                      <option value="">None applied</option>
                      {accounts?.items.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </SelectInput>
                  )}
                />
              </FormLayout.Column>

              <FormLayout.Column span={12}>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field, formState }) => (
                    <SelectInput
                      {...field}
                      label="Category"
                      error={formState.errors.categoryId?.message}
                    >
                      <option value="">None applied</option>
                      {categories?.items.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </SelectInput>
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
            <Button
              type="submit"
              form="filter-transaction-form"
              variant="primary"
            >
              Apply
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};

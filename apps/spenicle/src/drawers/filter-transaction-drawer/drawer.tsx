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
  ChipMultipleInput,
  Drawer,
  FormLayout,
  Icon,
  LoadingIndicator,
  TextInput,
} from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import {
  TrendingDownIcon,
  TrendingUpDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import {
  TransactionFilterModel,
  useTransactionsFilter,
} from '../../pages/transactions/hooks/use-transactions-filter';

interface FilterTransactionDrawerProps {
  payload?: Record<string, unknown>;
}

export const FilterTransactionDrawer: FC<FilterTransactionDrawerProps> = ({
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, setFilters } = useTransactionsFilter();
  const { closeDrawer, openDrawer } = useDrawerRoute();

  const { control, handleSubmit, watch } = useForm<TransactionFilterModel>({
    defaultValues: {
      accountId:
        (payload?.accountId as number[]) ?? appliedFilters?.accountId ?? [],
      categoryId:
        (payload?.categoryId as number[]) ?? appliedFilters?.categoryId ?? [],
      type: appliedFilters?.type ?? [],
    },
  });

  const [accountId, categoryId] = watch(['accountId', 'categoryId']);

  const [accounts, , { isFetching: isAccountsFetching }] =
    useApiSpenicleAccountsPaginatedQuery(
      {
        id: accountId,
        pageSize: 100,
      },
      {
        enabled: accountId.length > 0,
      },
    );

  const [categories, , { isFetching: isCategoriesFetching }] =
    useApiSpenicleCategoriesPaginatedQuery(
      {
        id: categoryId,
        pageSize: 100,
      },
      {
        enabled: categoryId.length > 0,
      },
    );

  const handleOnValidSubmit: SubmitHandler<TransactionFilterModel> = (data) => {
    setFilters({
      accountId: data.accountId ? data.accountId : undefined,
      categoryId: data.categoryId ? data.categoryId : undefined,
      type: data.type ? data.type : undefined,
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
                  render={({ field }) => (
                    <ChipMultipleInput
                      {...field}
                      variant="primary"
                      label="Type"
                    >
                      <ChipMultipleInput.Option value="expense">
                        <Icon as={TrendingDownIcon} color="inherit" size="sm" />
                        Expense
                      </ChipMultipleInput.Option>
                      <ChipMultipleInput.Option value="income">
                        <Icon as={TrendingUpIcon} color="inherit" size="sm" />
                        Income
                      </ChipMultipleInput.Option>
                      <ChipMultipleInput.Option value="transfer">
                        <Icon
                          as={TrendingUpDownIcon}
                          color="inherit"
                          size="sm"
                        />
                        Transfer
                      </ChipMultipleInput.Option>
                    </ChipMultipleInput>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="accountId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        label="Accounts"
                        placeholder="Select Account"
                        value={
                          field.value
                            ? accounts?.items?.map((acc) => acc.name).join(', ')
                            : ''
                        }
                        onChange={noop}
                        readOnly
                        onClick={handleOnAccountClick}
                        error={fieldState.error?.message}
                      />
                      <input
                        type="hidden"
                        {...field}
                        value={field.value.map(String)}
                      />
                    </>
                  )}
                />
              </FormLayout.Column>

              <FormLayout.Column span={12}>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        label="Categories"
                        placeholder="Select Category"
                        value={
                          field.value
                            ? categories?.items
                                ?.map((cat) => cat.name)
                                .join(', ')
                            : ''
                        }
                        onChange={noop}
                        readOnly
                        onClick={handleOnCategoryClick}
                        error={fieldState.error?.message}
                      />
                      <input
                        type="hidden"
                        {...field}
                        value={field.value.map(String)}
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

import { useApiSpenicleAccountQuery, useApiSpenicleCategoryQuery } from '@dimasbaguspm/hooks/use-api';
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  ChipSingleInput,
  DateSinglePickerInput,
  Drawer,
  FormLayout,
  Icon,
  LoadingIndicator,
  PriceInput,
  TextAreaInput,
  TextInput,
  TimePickerInput,
} from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { EditTransactionFormSchema } from './types';

interface EditTransactionFormProps {
  transaction: TransactionModel;
  defaultValues?: EditTransactionFormSchema;
  onSubmit: (data: EditTransactionFormSchema) => void;
}

export const EditTransactionForm: FC<EditTransactionFormProps> = ({ transaction, defaultValues, onSubmit }) => {
  const { openDrawer } = useDrawerRoute();

  const { register, handleSubmit, control, getValues, watch } = useForm<EditTransactionFormSchema>({
    defaultValues,
  });

  const [accountId, categoryId, destinationAccountId] = watch(['accountId', 'categoryId', 'destinationAccountId']);

  const [accountData, , { isLoading: isAccountLoading }] = useApiSpenicleAccountQuery(+accountId, {
    enabled: !!accountId,
  });
  const [destinationAccountData, , { isLoading: isDestinationAccountLoading }] = useApiSpenicleAccountQuery(
    +destinationAccountId!,
    {
      enabled: !!destinationAccountId,
    },
  );

  const [categoryData, , { isLoading: isCategoryLoading }] = useApiSpenicleCategoryQuery(+categoryId, {
    enabled: !!categoryId,
  });

  const handleOnAccountSelect = (name: string) => () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_ACCOUNT,
      {
        payloadId: name,
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.EDIT_TRANSACTION,
          returnToDrawerId: {
            transactionId: transaction.id,
          },
        },
      },
    );
  };

  const handleOnCategorySelect = (name: string) => () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_CATEGORY,
      {
        payloadId: name,
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.EDIT_TRANSACTION,
          returnToDrawerId: {
            transactionId: transaction.id,
          },
        },
      },
    );
  };

  const handleOnValidSubmit: SubmitHandler<EditTransactionFormSchema> = async (data) => {
    onSubmit(data);
  };

  return (
    <>
      <If condition={[isAccountLoading, isCategoryLoading, isDestinationAccountLoading]}>
        <LoadingIndicator size="sm" type="bar" />
      </If>

      <If condition={[!isAccountLoading, !isCategoryLoading, !isDestinationAccountLoading]}>
        <Drawer.Body>
          <form id="edit-transaction-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
            <FormLayout>
              <FormLayout.Column span={6}>
                <Controller
                  control={control}
                  name="date"
                  rules={{
                    validate: (value) => {
                      if (!value) {
                        return 'Date is required';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <DateSinglePickerInput label="Date" {...field} error={fieldState.error?.message} />
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={6}>
                <Controller
                  control={control}
                  name="time"
                  render={({ field, fieldState }) => (
                    <TimePickerInput label="Time" {...field} error={fieldState.error?.message} />
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  control={control}
                  name="type"
                  rules={{
                    required: 'Type is required',
                  }}
                  render={({ field }) => (
                    <ChipSingleInput {...field} variant="primary" label="Type">
                      <ChipSingleInput.Option value="expense">
                        <Icon as={TrendingDownIcon} color="inherit" size="sm" />
                        Expense
                      </ChipSingleInput.Option>
                      <ChipSingleInput.Option value="income">
                        <Icon as={TrendingUpIcon} color="inherit" size="sm" />
                        Income
                      </ChipSingleInput.Option>
                      <ChipSingleInput.Option value="transfer">
                        <Icon as={TrendingUpDownIcon} color="inherit" size="sm" />
                        Transfer
                      </ChipSingleInput.Option>
                    </ChipSingleInput>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  control={control}
                  name="amount"
                  rules={{
                    required: 'Amount is required',
                    min: {
                      value: 1,
                      message: 'Amount must be at least 1',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <PriceInput
                      label="Amount"
                      {...field}
                      // PriceInput likely expects a string value — provide a string representation
                      value={field.value == null ? '' : String(field.value)}
                      // normalize any incoming/formatted value to a number before updating the form state
                      onChange={(val) => {
                        // remove any non-numeric characters (except dot and minus) then parse
                        const cleaned = String(val).replace(/[^0-9.-]+/g, '');
                        const parsed = cleaned === '' ? 0 : parseFloat(cleaned);
                        field.onChange(Number.isNaN(parsed) ? 0 : parsed);
                      }}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </FormLayout.Column>

              <If condition={[watch('type') !== 'transfer']}>
                <FormLayout.Column span={12}>
                  <Controller
                    control={control}
                    name="accountId"
                    rules={{
                      validate: (value) => {
                        if (!value) {
                          return 'Account is required';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <TextInput
                          readOnly
                          onClick={handleOnAccountSelect('accountId')}
                          label="Source"
                          placeholder="Select account"
                          value={accountData?.name ?? ''}
                          error={fieldState.error?.message}
                        />
                        <input type="hidden" {...field} />
                      </>
                    )}
                  />
                </FormLayout.Column>
              </If>

              <If condition={[watch('type') === 'transfer']}>
                <FormLayout.Column span={12}>
                  <Controller
                    control={control}
                    name="accountId"
                    rules={{
                      deps: ['destinationAccountId'],
                      validate: (value) => {
                        if (!value) {
                          return 'Source account is required';
                        }

                        if (value === watch('destinationAccountId')) {
                          return 'From and To accounts must be different';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <TextInput
                          readOnly
                          onClick={handleOnAccountSelect('accountId')}
                          label="Source"
                          placeholder="Select account"
                          value={accountData?.name ?? ''}
                          error={fieldState.error?.message}
                        />
                        <input type="hidden" {...field} />
                      </>
                    )}
                  />
                </FormLayout.Column>
                <FormLayout.Column span={12}>
                  <Controller
                    control={control}
                    name="destinationAccountId"
                    rules={{
                      deps: ['accountId'],
                      validate: (value) => {
                        if (!value) {
                          return 'Destination account is required';
                        }

                        if (value === watch('accountId')) {
                          return 'From and To accounts must be different';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <TextInput
                          readOnly
                          onClick={handleOnAccountSelect('destinationAccountId')}
                          label="Destination"
                          placeholder="Select account"
                          value={destinationAccountData?.name ?? ''}
                          error={fieldState.error?.message}
                        />
                        <input type="hidden" {...field} />
                      </>
                    )}
                  />
                </FormLayout.Column>
              </If>

              <FormLayout.Column span={12}>
                <Controller
                  control={control}
                  name="categoryId"
                  rules={{
                    validate: (value) => {
                      if (!value) {
                        return 'Category is required';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        readOnly
                        label="Category"
                        onClick={handleOnCategorySelect('categoryId')}
                        placeholder="Select category"
                        value={categoryData?.name ?? ''}
                        error={fieldState.error?.message}
                      />
                      <input type="hidden" {...field} />
                    </>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <TextAreaInput label="Notes" fieldSizing="fixed" minRows={4} maxRows={4} {...register('notes')} />
              </FormLayout.Column>
            </FormLayout>
          </form>
        </Drawer.Body>
      </If>
    </>
  );
};

import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Anchor,
  Button,
  ChipSingleInput,
  DateSinglePickerInput,
  FormLayout,
  Icon,
  PageLoader,
  PriceInput,
  Text,
  TextAreaInput,
  TextInput,
  TimePickerInput,
} from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpDownIcon, TrendingUpIcon, Wand2Icon } from 'lucide-react';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { useNewTransactionData } from './hooks/use-new-transaction-data';
import { useNewTransactionSuggestion } from './hooks/use-new-transaction-suggestion';
import { NewTransactionFormSchema } from './types';

interface NewTransactionFormProps {
  defaultValues?: Partial<NewTransactionFormSchema>;
  onSubmit: (data: NewTransactionFormSchema) => void;
}

export const NewTransactionForm: FC<NewTransactionFormProps> = ({ defaultValues, onSubmit }) => {
  const { openDrawer } = useDrawerRoute();

  const { handleSubmit, control, getValues, watch, setValue } = useForm<NewTransactionFormSchema>({
    defaultValues: defaultValues,
  });

  const payload = watch();

  const { accountData, destinationAccountData, categoryData, isLoading } = useNewTransactionData(payload);
  const [suggestions, isVisible, fetchSuggestions, resetSuggestions] = useNewTransactionSuggestion(payload);

  const handleOnOpenSelectDrawer = (drawerId: string, fieldId: string) => () => {
    openDrawer(
      drawerId,
      {
        payloadId: fieldId,
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.NEW_TRANSACTION,
        },
      },
    );
  };

  const handleOnValidSubmit: SubmitHandler<NewTransactionFormSchema> = async (data) => {
    onSubmit(data);
  };

  return (
    <>
      <If condition={[isLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isLoading]}>
        <form id="new-transaction-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={6}>
              <Controller
                control={control}
                name="date"
                rules={{
                  required: 'Date is required',
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
                  <ChipSingleInput {...field} label="Type">
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
                    value={field.value == null ? '' : String(field.value)}
                    // normalize any incoming/formatted value to a number before updating the form state
                    onChange={(val) => {
                      // remove any non-numeric characters (except dot and minus) then parse
                      const cleaned = String(val).replace(/[^0-9-]+/g, '');
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
                        return 'Source account is required';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        readOnly
                        onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_ACCOUNT, 'accountId')}
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
                        return 'Source and Destination accounts must be different';
                      }

                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        readOnly
                        onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_ACCOUNT, 'accountId')}
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
                        return 'Source and Destination accounts must be different';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        readOnly
                        onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_ACCOUNT, 'destinationAccountId')}
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
                      onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_CATEGORY, 'categoryId')}
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
              <Controller
                name="notes"
                control={control}
                render={({ field, fieldState }) => (
                  <TextAreaInput
                    label="Notes"
                    row={4}
                    error={fieldState.error?.message}
                    helperText={
                      <>
                        <div className="flex flex-row items-center gap-2 mb-2">
                          <If condition={isVisible}>
                            <Icon as={Wand2Icon} color="ghost" size="sm" />
                            <Text fontSize="sm" color="gray">
                              Suggestions:
                            </Text>
                          </If>
                          <If condition={!isVisible}>
                            <Icon as={Wand2Icon} color="primary" size="sm" />
                            <Anchor fontSize="sm" onClick={() => fetchSuggestions()}>
                              Generate Suggestions
                            </Anchor>
                          </If>
                        </div>

                        <If condition={isVisible}>
                          <div className="flex flex-col gap-2">
                            <If condition={!!suggestions.length}>
                              <ul className="flex flex-row gap-2 flex-wrap">
                                {suggestions.map((suggestion) => (
                                  <li key={suggestion.trimmedNotes}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        field.onChange(suggestion.notes);
                                        if (!payload.accountId && suggestion.accountId) {
                                          setValue('accountId', suggestion.accountId);
                                        }
                                        if (!payload.categoryId && suggestion.categoryId) {
                                          setValue('categoryId', suggestion.categoryId);
                                        }
                                        if (!payload.amount && suggestion.amount) {
                                          setValue('amount', suggestion.amount);
                                        }
                                        resetSuggestions();
                                      }}
                                    >
                                      {suggestion.trimmedNotes}
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </If>
                            <If condition={!suggestions.length}>
                              <Text fontSize="sm" color="gray">
                                No suggestions available
                              </Text>
                            </If>
                            <Anchor onClick={() => fetchSuggestions()} fontSize="sm">
                              Regenerate
                            </Anchor>
                          </div>
                        </If>
                      </>
                    }
                    {...field}
                  />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </If>
    </>
  );
};

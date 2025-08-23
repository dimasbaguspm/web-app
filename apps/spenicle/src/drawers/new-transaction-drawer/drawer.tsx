import { useApiSpenicleCreateTransaction } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  DateSinglePickerInput,
  Drawer,
  FormLayout,
  PriceInput,
  Tabs,
  TextAreaInput,
  TextInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface NewTransactionDrawerProps {
  payload?: Record<string, string>;
}

export const NewTransactionDrawer: FC<NewTransactionDrawerProps> = ({
  payload,
}) => {
  const { openDrawer, closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createTransaction, , { isPending }] =
    useApiSpenicleCreateTransaction();

  const { register, handleSubmit, control, formState, getValues, watch } =
    useForm({
      defaultValues: {
        type: payload?.type ?? 'expense',
        date: payload?.date ?? dayjs().toISOString(),
        accountId: payload?.accountId ?? '',
        categoryId: payload?.categoryId ?? '',
        amount: payload?.amount
          ? isNaN(+payload?.amount)
            ? 0
            : +payload.amount!
          : 0,
        notes: payload?.notes ?? '',
      },
    });

  const handleOnAccountSelect = () => {
    openDrawer(DRAWER_ROUTES.SELECT_ACCOUNT, null, {
      replace: true,
      state: {
        payload: getValues(),
      },
    });
  };

  const handleOnCategorySelect = () => {
    openDrawer(DRAWER_ROUTES.SELECT_CATEGORY, null, {
      replace: true,
      state: {
        payload: getValues(),
      },
    });
  };

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createTransaction({
      type: data.type,
      date: data.date,
      amount: data.amount,
      categoryId: data.categoryId,
      accountId: data.accountId,
      destinationAccountId: data.destinationAccountId || null,
      note: data.note ?? '',
    });

    showSnack('success', 'Transaction created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>Create Transaction</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Tabs value={field.value} onValueChange={field.onChange}>
              <Tabs.Trigger value="expense">Expense</Tabs.Trigger>
              <Tabs.Trigger value="income">Income</Tabs.Trigger>
              <Tabs.Trigger value="transfer">Transfer</Tabs.Trigger>
            </Tabs>
          )}
        />
      </Drawer.Tab>
      <Drawer.Body>
        <form
          id="new-transaction-form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
        >
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="date"
                rules={{
                  required: 'Date is required',
                }}
                render={({ field, fieldState }) => (
                  <DateSinglePickerInput
                    label="Date"
                    {...field}
                    error={fieldState.error?.message}
                  />
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
                    value: 0,
                    message: 'Amount must be positive',
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
                    required: 'Account is required',
                  }}
                  render={({ field, fieldState }) => (
                    <TextInput
                      readOnly
                      onClick={handleOnAccountSelect}
                      label="Account"
                      placeholder="Select account"
                      {...field}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </FormLayout.Column>
            </If>

            <If condition={[watch('type') === 'transfer']}>
              <FormLayout.Column span={6}>
                <TextInput readOnly label="From" placeholder="Select account" />
              </FormLayout.Column>
              <FormLayout.Column span={6}>
                <TextInput readOnly label="To" placeholder="Select account" />
              </FormLayout.Column>
            </If>

            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="categoryId"
                rules={{
                  required: 'Category is required',
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    readOnly
                    label="Category"
                    onClick={handleOnCategorySelect}
                    placeholder="Select category"
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <TextAreaInput
                label="Notes"
                fieldSizing="content"
                rows={6}
                {...register('notes')}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-transaction-form"
            disabled={isPending || !formState.isValid}
          >
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

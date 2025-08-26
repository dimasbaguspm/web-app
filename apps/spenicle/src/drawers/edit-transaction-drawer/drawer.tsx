import {
  useApiSpenicleTransactionQuery,
  useApiSpenicleUpdateTransaction,
} from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  LoadingIndicator,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { EditTransactionForm } from './form';
import { EditTransactionFormSchema } from './types';

interface EditTransactionDrawerProps {
  transactionId: number;
  payload?: Record<string, string>;
}

export const EditTransactionDrawer: FC<EditTransactionDrawerProps> = ({
  transactionId,
  payload,
}) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [transactionData, , { isLoading }] =
    useApiSpenicleTransactionQuery(transactionId);

  const [updateTransaction, , { isPending }] =
    useApiSpenicleUpdateTransaction();

  const shouldUsePayload = payload && Object.keys(payload).length > 0;

  const defaultValues: EditTransactionFormSchema = shouldUsePayload
    ? {
        type: (payload?.type ?? 'expense') as EditTransactionFormSchema['type'],
        date: payload?.date ?? dayjs().toISOString(),
        time: payload?.time ?? formatDate(dayjs(), DateFormat.TIME_24H),
        accountId: payload?.accountId ? +payload.accountId : 0,
        destinationAccountId: payload?.destinationAccountId
          ? +payload.destinationAccountId
          : 0,
        categoryId: payload?.categoryId ? +payload.categoryId : 0,
        amount: payload?.amount
          ? isNaN(+payload?.amount)
            ? 0
            : +payload.amount!
          : 0,
        note: payload?.notes ?? '',
      }
    : {
        type: transactionData?.type ?? 'expense',
        date: formatDate(
          transactionData?.date ?? dayjs().toISOString(),
          DateFormat.ISO_DATE,
        ),
        time: formatDate(
          transactionData?.date ?? dayjs().toISOString(),
          DateFormat.TIME_24H,
        ),
        accountId: transactionData?.accountId ?? 0,
        destinationAccountId: transactionData?.destinationAccountId ?? 0,
        categoryId: transactionData?.categoryId ?? 0,
        amount: transactionData?.amount ? +transactionData.amount : 0,
        note: transactionData?.note ?? '',
      };

  const handleOnSubmit: SubmitHandler<FieldValues> = async (data) => {
    let date = dayjs(data.date);

    // parse hour and minute from the time string and coerce to numbers
    const [hourStr = '0', minuteStr = '0'] = (data.time ?? '').split(':');
    const hour = Number.parseInt(hourStr, 10) || 0;
    const minute = Number.parseInt(minuteStr, 10) || 0;

    date = date.set('hour', hour).set('minute', minute);

    await updateTransaction({
      id: transactionId,
      type: data.type,
      date: date.toISOString(),
      amount: data.amount,
      categoryId: data.categoryId,
      accountId: data.accountId,
      destinationAccountId:
        data.type === 'transfer' ? data.destinationAccountId : null,
      note: data.note ?? '',
    });

    showSnack('success', 'Transaction created successfully');
    closeDrawer();
  };

  return (
    <>
      <If condition={[isLoading, !transactionData]}>
        <Drawer.Header hasTab>
          <Drawer.Title>Edit Transaction</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isLoading, transactionData]}>
        <Drawer.Header hasTab>
          <Drawer.Title>Edit Transaction</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <EditTransactionForm
          transaction={transactionData!}
          defaultValues={defaultValues}
          onSubmit={handleOnSubmit}
        />
        <Drawer.Footer>
          <ButtonGroup alignment="end">
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-transaction-form"
              disabled={isPending}
            >
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};

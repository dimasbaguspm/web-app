import { useApiSpenicleTransactionQuery, useApiSpenicleUpdateTransaction } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { EditTransactionForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditTransactionFormSchema } from './types';

interface EditTransactionDrawerProps {
  transactionId: number;
  payload?: Record<string, string>;
}

export const EditTransactionDrawer: FC<EditTransactionDrawerProps> = ({ transactionId, payload }) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [transactionData, , { isLoading }] = useApiSpenicleTransactionQuery(transactionId);

  const [updateTransaction, , { isPending }] = useApiSpenicleUpdateTransaction();

  const handleOnSubmit: SubmitHandler<EditTransactionFormSchema> = async (data) => {
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
      destinationAccountId: data.type === 'transfer' && data.destinationAccountId ? data.destinationAccountId : null,
      note: data.notes ?? '',
    });

    showSnack('success', 'Transaction created successfully');
    closeDrawer();
  };

  return (
    <>
      <If condition={[isLoading, !transactionData]}>
        <Drawer.Header>
          <Drawer.Title>Edit Transaction</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>

      <If condition={[!isLoading, transactionData]}>
        <Drawer.Header>
          <Drawer.Title>Edit Transaction</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <EditTransactionForm
          transaction={transactionData!}
          defaultValues={formatDefaultValues(transactionData, payload)}
          onSubmit={handleOnSubmit}
        />
        <Drawer.Footer>
          <ButtonGroup alignment="end" fluid={!isDesktop}>
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" form="edit-transaction-form" disabled={isPending}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};

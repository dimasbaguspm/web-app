import { useApiSpenicleCreateTransaction } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  Drawer,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';

import { NewTransactionForm } from './form';
import { formatDefaultValues } from './helpers';
import { NewTransactionFormSchema } from './types';

interface NewTransactionDrawerProps {
  payload?: Record<string, string>;
}

export const NewTransactionDrawer: FC<NewTransactionDrawerProps> = ({
  payload,
}) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [createTransaction, , { isPending }] =
    useApiSpenicleCreateTransaction();

  const handleOnValidSubmit = async (data: NewTransactionFormSchema) => {
    let date = dayjs(data.date);

    // parse hour and minute from the time string and coerce to numbers
    const [hourStr = '0', minuteStr = '0'] = (data.time ?? '').split(':');
    const hour = Number.parseInt(hourStr, 10) || 0;
    const minute = Number.parseInt(minuteStr, 10) || 0;

    date = date.set('hour', hour).set('minute', minute);

    await createTransaction({
      type: data.type,
      date: date.toISOString(),
      amount: data.amount,
      categoryId: data.categoryId,
      accountId: data.accountId,
      destinationAccountId:
        data.type === 'transfer' && data.destinationAccountId
          ? data.destinationAccountId
          : null,
      note: data.notes ?? '',
    });

    showSnack('success', 'Transaction created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Transaction</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <NewTransactionForm
        defaultValues={formatDefaultValues(payload)}
        onSubmit={handleOnValidSubmit}
      />

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-transaction-form"
            disabled={isPending}
          >
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

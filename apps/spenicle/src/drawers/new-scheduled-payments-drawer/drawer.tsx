import { useApiSpenicleCreateScheduledTransaction } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';

import { NewScheduledPaymentsForm } from './form';
import { formatDefaultValues } from './helpers';
import { NewScheduledPaymentsFormSchema } from './types';

interface Props {
  payload?: Record<string, string>;
}

export const NewScheduledPaymentsDrawer: FC<Props> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const [createScheduledTransaction, , { isPending }] = useApiSpenicleCreateScheduledTransaction();

  const handleOnSubmit = async (data: NewScheduledPaymentsFormSchema) => {
    await createScheduledTransaction({
      name: data.name,
      type: data.type,
      startDate: dayjs(data.startDate).set('h', dayjs().hour()).set('m', dayjs().minute()).toISOString(),
      frequency: data.frequency,
      interval: data.interval,
      until: data.until ? dayjs(data.until).set('h', dayjs().hour()).set('m', dayjs().minute()).toISOString() : null,
      amount: data.amount,
      accountId: +data.accountId,
      categoryId: +data.categoryId,
      note: data.notes,
      immediate: data.immediate || false,
    });
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Scheduled Payment</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <NewScheduledPaymentsForm onSubmit={handleOnSubmit} defaultValues={formatDefaultValues(payload)} />
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button form="new-scheduled-payments-form" type="submit" disabled={isPending}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

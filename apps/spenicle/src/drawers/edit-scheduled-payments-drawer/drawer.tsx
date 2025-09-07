import {
  useApiSpenicleScheduledTransactionQuery,
  useApiSpenicleUpdateScheduledTransaction,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { EditScheduledPaymentsForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditScheduledPaymentsFormSchema } from './types';

interface Props {
  scheduledTransactionId: number;
  payload?: Record<string, string>;
}

export const EditScheduledPaymentsDrawer: FC<Props> = ({ scheduledTransactionId, payload }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();

  const [scheduledTransaction, , { isLoading }] = useApiSpenicleScheduledTransactionQuery(scheduledTransactionId);
  const [editScheduledTransaction, , { isPending }] = useApiSpenicleUpdateScheduledTransaction();

  const handleOnSubmit = async (data: EditScheduledPaymentsFormSchema) => {
    await editScheduledTransaction({
      id: scheduledTransactionId,
      name: data.name,
      type: data.type,
      frequency: data.frequency,
      interval: data.interval,
      until: data.until,
      amount: data.amount,
      accountId: +data.accountId,
      categoryId: +data.categoryId,
      note: data.notes,
    });
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Scheduled Payment</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={!isLoading}>
          <EditScheduledPaymentsForm
            onSubmit={handleOnSubmit}
            defaultValues={formatDefaultValues(scheduledTransaction, payload)}
          />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button form="edit-scheduled-payments-form" type="submit" disabled={isPending}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

import {
  useApiSpenicleAccountGroupQuery,
  useApiSpenicleCreateAccountGroupMembers,
  useApiSpenicleDeleteAccountGroupMembers,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { Form } from './form';
import { AddAccountGroupMemberFormSchema } from './types';

interface AddAccountGroupMemberDrawerProps {
  accountGroupId: number;
}

export const AddAccountGroupMemberDrawer: FC<AddAccountGroupMemberDrawerProps> = ({ accountGroupId }) => {
  const { openDrawer, closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const [accountGroup, , { isLoading: isFetchingAccountGroup }] = useApiSpenicleAccountGroupQuery(accountGroupId);
  const [addToGroupMembers, , { isPending: isPendingSubmit }] = useApiSpenicleCreateAccountGroupMembers();
  const [removeFromGroupMembers, , { isPending: isPendingRemove }] = useApiSpenicleDeleteAccountGroupMembers();

  const { handleSubmit, reset, setValue, watch } = useForm<AddAccountGroupMemberFormSchema>({
    defaultValues: {
      accountIds: accountGroup?.memberIds,
    },
  });

  useEffect(() => {
    reset({
      accountIds: accountGroup?.memberIds || [],
    });
  }, [accountGroup, reset]);

  const handleCreateNewAccount = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT);
  };

  const handleOnAccountSelect = (ids: number[]) => {
    setValue('accountIds', ids, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleOnSubmit: SubmitHandler<AddAccountGroupMemberFormSchema> = async (data) => {
    const currentMemberIds = accountGroup?.memberIds || [];
    const idsToRemove = currentMemberIds.filter((id) => !data.accountIds.includes(id));
    const idsToAdd = data.accountIds.filter((id) => !currentMemberIds.includes(id));

    console.log({ idsToAdd, idsToRemove });
    if (idsToAdd.length) {
      await addToGroupMembers({
        accountGroupId,
        accountId: idsToAdd,
      });
    }
    if (idsToRemove.length) {
      await removeFromGroupMembers({
        accountGroupId,
        accountId: idsToRemove,
      });
    }

    closeDrawer();
  };

  const isPending = isPendingSubmit || isPendingRemove;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage Members</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isFetchingAccountGroup}>
          <PageLoader />
        </If>
        <If condition={!isFetchingAccountGroup}>
          <Form
            accountIds={watch('accountIds') || []}
            handleCreateNewAccount={handleCreateNewAccount}
            handleOnAccountSelect={handleOnAccountSelect}
          />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button form="select-account-form" onClick={handleSubmit(handleOnSubmit)} disabled={isPending}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

import {
  useApiHiAddBulkGroupMembers,
  useApiHiGroupQuery,
  useApiHiRemoveBulkGroupMembers,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatHiGroup } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from './form';
import { ManageGroupMemberFormSchema } from './types';

interface ManageGroupMemberDrawerProps {
  groupId: number;
}

export const ManageGroupMemberDrawer: FC<ManageGroupMemberDrawerProps> = ({ groupId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const [group, , { isLoading }] = useApiHiGroupQuery(groupId);

  const [addToGroupMembers, , { isPending: isPendingSubmit }] = useApiHiAddBulkGroupMembers();
  const [removeFromGroupMembers, , { isPending: isPendingRemove }] = useApiHiRemoveBulkGroupMembers();

  const form = useForm<ManageGroupMemberFormSchema>({
    defaultValues: {
      userIds: [group?.creatorId],
    },
  });

  useEffect(() => {
    form.reset({
      userIds: group?.memberIds,
    });
  }, [group, form.reset]);

  const formattedGroup = formatHiGroup(group);

  const handleOnUserSelect = (ids: number[]) => {
    form.setValue('userIds', ids, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleOnSubmit = async (data: ManageGroupMemberFormSchema) => {
    const currentMemberIds = group?.memberIds || [];
    const idsToRemove = currentMemberIds.filter((id) => !data.userIds.includes(id));
    const idsToAdd = data.userIds.filter((id) => !currentMemberIds.includes(id));

    if (idsToAdd.length) {
      await addToGroupMembers({
        id: groupId,
        userIds: idsToAdd,
      });
    }
    if (idsToRemove.length) {
      await removeFromGroupMembers({
        id: groupId,
        userIds: idsToRemove,
      });
    }

    closeDrawer();
  };

  const isPending = isPendingSubmit || isPendingRemove;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage {formattedGroup.name} Members</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={!isLoading}>
          <Form userIds={form.watch('userIds') || []} handleOnUserSelect={handleOnUserSelect} />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleOnSubmit)} disabled={isPending}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

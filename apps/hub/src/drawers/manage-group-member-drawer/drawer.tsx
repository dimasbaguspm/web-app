import { useApiHiGroupQuery } from '@dimasbaguspm/hooks/use-api';
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

  const form = useForm<ManageGroupMemberFormSchema>({
    defaultValues: {
      userIds: [group?.creatorId],
    },
  });

  useEffect(() => {
    form.reset({
      // TODO: support it form backend to get member Ids within the group model
      userIds: [group?.creatorId],
    });
  }, [group, form.reset]);

  const formattedGroup = formatHiGroup(group);

  const handleOnUserSelect = (ids: number[]) => {
    form.setValue('userIds', ids, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

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
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button>Save</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

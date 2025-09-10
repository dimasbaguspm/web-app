import { useApiHiGroupQuery, useApiHiUpdateGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { EditGroupForm } from './form';
import { EditGroupFormSchema } from './types';

interface EditGroupDrawerProps {
  groupId: number;
}

export const EditGroupDrawer: FC<EditGroupDrawerProps> = ({ groupId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [group, , { isLoading }] = useApiHiGroupQuery(groupId);

  const [updateGroup, , { isPending: isPendingUpdateGroup }] = useApiHiUpdateGroup();

  const handleOnSubmit = async (data: EditGroupFormSchema) => {
    await updateGroup({ id: groupId, name: data.name });
    showSnack('success', 'Group updated successfully');

    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading, !group]}>
          <NoResults
            icon={SearchXIcon}
            title="Group not found"
            subtitle="We couldn't find the group you're looking for."
          />
        </If>
        <If condition={[!isLoading, group]}>
          <EditGroupForm
            defaultValues={{
              name: group?.name || '',
            }}
            handleOnSubmit={handleOnSubmit}
          />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" disabled={isPendingUpdateGroup}>
            Cancel
          </Button>
          <Button type="submit" form="new-group-form" disabled={isPendingUpdateGroup}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

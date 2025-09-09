import { useApiHiCreateAppProfile } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { NewAppProfileForm } from './form';

interface NewAppProfileDrawerProps {
  appId: number;
}

export const NewAppProfileDrawer: FC<NewAppProfileDrawerProps> = ({ appId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const [createAppProfile] = useApiHiCreateAppProfile();

  const handleOnSubmit = async () => {
    return;
    await createAppProfile({
      appId,
      name: 'New Profile',
    });
  };

  return (
    <>
      <Drawer.Header>New App Profile</Drawer.Header>
      <Drawer.Body>
        <form id="new-app-profile-form" onSubmit={handleOnSubmit}>
          <NewAppProfileForm defaultValues={{ name: '' }} />
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button form="new-app-profile-form" type="submit">
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

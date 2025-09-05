import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export const DetailScheduledPaymentsDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Detail Scheduled Payments</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <PageLoader />
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="update-account-group-form">
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

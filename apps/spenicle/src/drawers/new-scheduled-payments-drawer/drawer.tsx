import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Button, ButtonGroup, Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export const NewScheduledPaymentsDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Scheduled Payment</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>New Scheduled Payment Form</Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

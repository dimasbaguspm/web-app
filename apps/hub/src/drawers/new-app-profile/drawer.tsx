import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface NewAppProfileDrawerProps {
  appId: number;
}

export const NewAppProfileDrawer: FC<NewAppProfileDrawerProps> = () => {
  const { closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  return (
    <>
      <Drawer.Header>New App Profile</Drawer.Header>
      <Drawer.Body>
        <FormLayout>
          <FormLayout.Column span={12}>
            <TextInput label="Profile Name" placeholder="Enter profile name" required />
          </FormLayout.Column>
        </FormLayout>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="tertiary" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button onClick={closeDrawer}>Create</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

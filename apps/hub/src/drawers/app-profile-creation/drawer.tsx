import { Button, Drawer, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export const AppProfileCreationDrawer: FC = () => {
  return (
    <>
      <Drawer.Header>
        <Text as="h2" fontSize="lg" fontWeight="semibold">
          App Profile Creation
        </Text>
      </Drawer.Header>
      <Drawer.Body>
        <Text as="p" color="gray">
          This feature is under development. Please check back later.
        </Text>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Drawer.Footer>
    </>
  );
};

import { AppModel } from '@dimasbaguspm/interfaces';
import { Drawer, Heading } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ChangeLogTabProps {
  app: AppModel;
}

export const ChangeLogTab: FC<ChangeLogTabProps> = () => {
  return (
    <>
      <Drawer.Body>
        <Heading>TBA</Heading>
      </Drawer.Body>
    </>
  );
};

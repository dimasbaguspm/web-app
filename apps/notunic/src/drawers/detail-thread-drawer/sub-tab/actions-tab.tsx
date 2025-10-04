import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ActionsTabProps {
  thread: ThreadModel;
}

export const ActionsTab: FC<ActionsTabProps> = () => {
  return (
    <>
      <Drawer.Body>
        <p>Actions Tab Content</p>
      </Drawer.Body>
    </>
  );
};

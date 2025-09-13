import { AppModel } from '@dimasbaguspm/interfaces';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DetailsTabProps {
  app: AppModel;
}

export const DetailsTab: FC<DetailsTabProps> = () => {
  return (
    <>
      <Drawer.Body>
        <div>TODO</div>
        <p>Video introduction</p>
        <p>Main feature</p>
        <p>Documentation link</p>
        <p>Support link</p>
        <p>Terms of service link</p>
        <p>Privacy policy link</p>
        <p>App version</p>
        <p>Last updated date</p>
      </Drawer.Body>
    </>
  );
};

import { useApiHiAppProfilesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AppModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DetailsTabProps {
  app: AppModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ app }) => {
  const { isDesktop } = useWindowResize();

  const [profiles] = useApiHiAppProfilesInfiniteQuery({
    appId: [app.id],
    pageSize: 1,
  });

  const handleOnLaunchClick = () => {
    window.open(app.url, '_blank');
  };

  const hasProfiles = profiles && profiles.length > 0;

  return (
    <>
      <Drawer.Body>
        <div>Details Tab</div>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <If condition={hasProfiles}>
            <Button onClick={handleOnLaunchClick}>Launch</Button>
          </If>
          <If condition={!hasProfiles}>
            <Button onClick={handleOnLaunchClick}>Create Profile</Button>
          </If>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

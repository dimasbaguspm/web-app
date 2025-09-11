import { useApiHiAppProfilesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { AppProfileCard } from '../../../components/app-profile-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface ProfilesTabProps {
  app: AppModel;
}

export const ProfilesTab: FC<ProfilesTabProps> = ({ app }) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const [profiles, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiHiAppProfilesInfiniteQuery({
      appId: [app.id],
    });

  const handleOnCreateClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_APP_PROFILE, { appId: app.id });
  };

  const handleOnCardClick = (appProfile: AppProfileModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_APP_PROFILE, { appProfileId: appProfile.id });
  };

  return (
    <>
      <Drawer.Body>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, profiles?.length]}>
          <ul className="mb-4">
            {profiles?.map((profile, index) => {
              const isLastItem = index === profiles.length - 1;

              return (
                <li key={profile.id}>
                  <AppProfileCard app={app} appProfile={profile} onClick={handleOnCardClick} />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button disabled={isFetchingNextPage} variant="outline" onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!isInitialFetching, !profiles?.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No profiles found"
            subtitle="You haven't created any profiles for this app"
          />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button onClick={handleOnCreateClick}>Create New Profile</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

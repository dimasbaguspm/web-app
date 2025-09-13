import { useApiHiAppProfilesInfiniteQuery, useApiHiAppsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { AppProfileModel, GroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { AppProfileCard } from '../../../components/app-profile-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface ProfilesTabProps {
  group: GroupModel;
}

export const ProfilesTab: FC<ProfilesTabProps> = ({ group }) => {
  const { openDrawer } = useDrawerRoute();

  const [apps, , { isInitialFetching: isInitialFetchingApps }] = useApiHiAppsInfiniteQuery({ pageSize: 100 });
  const [
    profiles,
    ,
    { isInitialFetching: isInitialFetchingAppProfiles, isFetchingNextPage, hasNextPage },
    { fetchNextPage },
  ] = useApiHiAppProfilesInfiniteQuery({ groupId: [group.id] });

  const handleOnCardClick = (profile: AppProfileModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_APP_PROFILE, { appProfileId: profile.id });
  };

  const isInitialFetching = isInitialFetchingAppProfiles || isInitialFetchingApps;
  return (
    <>
      <If condition={[isInitialFetching]}>
        <PageLoader />
      </If>
      <If condition={!isInitialFetching && !profiles.length}>
        <NoResults
          icon={SearchXIcon}
          title="No Profiles Found"
          subtitle="We couldn't find any profiles in this group"
        />
      </If>
      <If condition={[!isInitialFetching && profiles.length]}>
        <ul className="mb-4">
          {profiles?.map((profile, index) => {
            const app = apps.find((app) => app.id === profile.appId);
            const isLastItem = profiles.length === index + 1;
            return (
              <li>
                <AppProfileCard
                  appProfile={profile}
                  onClick={handleOnCardClick}
                  app={app!}
                  hideGroupRelatedBadge
                  useBrandAvatar
                />
                {!isLastItem && <Hr />}
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPage}>
          <ButtonGroup alignment="center">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};

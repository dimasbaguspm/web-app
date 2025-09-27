import { useApiNotunicThreadGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Hr, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { ThreadGroupCard } from '../../components/thread-group-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

export const ManageThreadGroupDrawer: FC = () => {
  const { openDrawer } = useDrawerRoute();
  const [threadGroups, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadGroupsInfiniteQuery({});

  const handleOpenNewThreadGroup = () => {
    openDrawer(DRAWER_ROUTES.NEW_THREAD_GROUP);
  };

  const handleOnCardClick = (threadGroup: ThreadGroupModel) => () => {
    openDrawer(DRAWER_ROUTES.DETAIL_THREAD_GROUP, { threadGroupId: threadGroup.id });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage Thread Groups</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={[!isInitialFetching, !threadGroups.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No Thread Groups"
            subtitle="You have not created any thread groups yet."
            action={
              <ButtonGroup alignment="center">
                <Button variant="outline" onClick={handleOpenNewThreadGroup}>
                  New Thread Group
                </Button>
              </ButtonGroup>
            }
          />
        </If>
        <If condition={[!isInitialFetching, !!threadGroups.length]}>
          <ButtonGroup hasMargin>
            <Button variant="outline" onClick={handleOpenNewThreadGroup}>
              <Icon as={PlusIcon} size="sm" color="inherit" />
              New Thread Group
            </Button>
          </ButtonGroup>
          <ul className="mb-4">
            {threadGroups.map((threadGroup, index) => {
              const isLastItem = index === threadGroups.length - 1;

              return (
                <li key={threadGroup.id}>
                  <ThreadGroupCard threadGroup={threadGroup} onClick={handleOnCardClick(threadGroup)} />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>
      </Drawer.Body>
    </>
  );
};

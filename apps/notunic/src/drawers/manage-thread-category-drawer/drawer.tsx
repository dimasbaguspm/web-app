import {
  useApiNotunicThreadCategoryMembersInfiniteQuery,
  useApiNotunicThreadCategoryQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicThreadCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { BoltIcon, Edit2Icon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface ManageThreadCategoryDrawerProps {
  threadCategoryId: number;
}

export const ManageThreadCategoryDrawer: FC<ManageThreadCategoryDrawerProps> = ({ threadCategoryId }) => {
  const { openDrawer } = useDrawerRoute();
  const [threadCategory, , { isLoading: isThreadCategoryLoading }] = useApiNotunicThreadCategoryQuery(threadCategoryId);

  // TODO: it should return the meaningful data
  const [threadCategoryMembers, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadCategoryMembersInfiniteQuery({
      threadCategoryId: [threadCategoryId],
    });

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_THREAD_CATEGORY, { threadCategoryId });
  };

  const handleOnManageMembersClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_THREAD_CATEGORY_MEMBERS, { threadCategoryId });
  };

  const { name } = formatNotunicThreadCategory(threadCategory);
  const isLoading = isThreadCategoryLoading || isInitialFetching;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage {name || 'Thread'} Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={!isLoading}>
          <If condition={!threadCategory}>
            <NoResults
              icon={SearchXIcon}
              title="Thread category not found"
              subtitle="The thread category does not exist"
            />
          </If>
          <If condition={Boolean(threadCategory)}>
            <ButtonGroup hasMargin>
              <Button variant="outline" onClick={handleOnEditClick}>
                <Icon as={Edit2Icon} size="sm" color="inherit" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleOnManageMembersClick}>
                <Icon as={BoltIcon} size="sm" color="inherit" />
                Manage Members
              </Button>
            </ButtonGroup>
            <If condition={threadCategoryMembers.length === 0}>
              <NoResults
                icon={SearchXIcon}
                title="No members"
                subtitle="There are no members in this thread category"
              />
            </If>
            <If condition={threadCategoryMembers.length > 0}>
              <ul className="mb-4">
                {threadCategoryMembers.map((member) => (
                  <li key={member.threadId}>{member.threadId}</li>
                ))}
              </ul>
              <If condition={hasNextPage}>
                <ButtonGroup alignment="center">
                  <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    Load more
                  </Button>
                </ButtonGroup>
              </If>
            </If>
          </If>
        </If>
      </Drawer.Body>
    </>
  );
};

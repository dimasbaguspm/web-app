import { useApiNotunicThreadGroupQuery, useApiNotunicThreadGroupTagsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ThreadGroupTagModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatNotunicThreadGroup } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonIcon, Drawer, Hr, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { Edit2Icon, PlusIcon, SearchXIcon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { ThreadGroupTagCard } from '../../components/thread-group-tag-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

interface DetailThreadGroupDrawerProps {
  threadGroupId: number;
}

export const DetailThreadGroupDrawer: FC<DetailThreadGroupDrawerProps> = ({ threadGroupId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [threadGroup, , { isLoading }] = useApiNotunicThreadGroupQuery(threadGroupId);
  const [tags, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadGroupTagsInfiniteQuery({ threadGroupId: [threadGroupId] });

  const formattedThreadGroup = formatNotunicThreadGroup(threadGroup);

  const handleOnEditThreadGroupClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_THREAD_GROUP, { threadGroupId });
  };

  const handleOnNewTagClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_THREAD_GROUP_TAG, { threadGroupId });
  };

  const handleOnThreadGroupTagClick = (threadGroupTag: ThreadGroupTagModel) => {
    openDrawer(DRAWER_ROUTES.EDIT_THREAD_GROUP_TAG, { threadGroupId, threadGroupTagId: threadGroupTag.id });
  };

  const handleOnDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_THREAD_GROUP, { threadGroupId });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{formattedThreadGroup.name ?? 'Thread Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading, !threadGroup]}>
          <NoResults
            icon={SearchXIcon}
            title="Thread Group not found"
            subtitle="The thread group you are looking for does not exist."
          />
        </If>
        <If condition={[!isLoading, !!threadGroup]}>
          <ButtonGroup hasMargin alignment="between">
            <ButtonGroup>
              <Button variant="outline" onClick={handleOnEditThreadGroupClick}>
                <Icon as={Edit2Icon} size="sm" color="inherit" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleOnNewTagClick}>
                <Icon as={PlusIcon} size="sm" color="inherit" />
                Add Tag
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <ButtonIcon variant="danger-outline" as={TrashIcon} onClick={handleOnDeleteClick} aria-label="Delete" />
            </ButtonGroup>
          </ButtonGroup>
          <If condition={isInitialFetching}>
            <PageLoader />
          </If>
          <If condition={[!isInitialFetching, tags.length === 0]}>
            <NoResults
              icon={SearchXIcon}
              title="No Tags"
              subtitle="This thread group has no tags. Click the 'Add Tag' button to add a new tag."
            />
          </If>
          <If condition={[!isInitialFetching, tags.length > 0]}>
            <ul className="mb-4">
              {tags.map((tag, index) => {
                const isLastItem = index === tags.length - 1;

                return (
                  <li key={tag.id}>
                    <ThreadGroupTagCard threadGroupTag={tag} onClick={handleOnThreadGroupTagClick} />
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
        </If>
      </Drawer.Body>
    </>
  );
};

import { useApiNotunicThreadQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, NoResults, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { ActionsTab } from './sub-tab/actions-tab';
import { CommentsTab } from './sub-tab/comments-tab';
import { DetailThreadSubTab } from './types';

interface DetailThreadDrawerProps {
  threadId: number;
  spaceId: number;
  parentCommentId?: number | null;
  tabId?: string;
}

export const DetailThreadDrawer: FC<DetailThreadDrawerProps> = ({
  threadId,
  spaceId,
  parentCommentId = null,
  tabId,
}) => {
  const [mainThread, , { isLoading: isLoadingMainThread }] = useApiNotunicThreadQuery(threadId, {
    enabled: !!threadId,
  });

  const { openDrawer } = useDrawerRoute();

  const formattedThreadGroup = formatNotunicThread(mainThread);

  const isLoading = isLoadingMainThread;

  const activeTab = tabId || DetailThreadSubTab.Comments;

  const handleOnTabChange = (value: string) => {
    openDrawer(
      DRAWER_ROUTES.DETAIL_THREAD,
      {
        threadId,
        spaceId,
        parentCommentId: parentCommentId ?? '',
        tabId: value,
      },
      {
        replace: true,
      },
    );
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>
          {parentCommentId ? 'Replying to comment' : (formattedThreadGroup.title ?? 'Thread Details')}
        </Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <Tabs.Trigger value={DetailThreadSubTab.Comments}>Comments</Tabs.Trigger>
          <Tabs.Trigger value={DetailThreadSubTab.Actions}>Actions</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>

      <If condition={[isLoading]}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={[!isLoading, !mainThread]}>
        <Drawer.Body>
          <NoResults
            icon={SearchXIcon}
            title="Thread not found"
            subtitle="The thread you are looking for does not exist"
          />
        </Drawer.Body>
      </If>
      <If condition={[!isLoading, mainThread]}>
        <If condition={activeTab === DetailThreadSubTab.Comments}>
          <CommentsTab thread={mainThread!} parentCommentId={parentCommentId} />
        </If>
        <If condition={activeTab === DetailThreadSubTab.Actions}>
          <ActionsTab thread={mainThread!} />
        </If>
      </If>
    </>
  );
};

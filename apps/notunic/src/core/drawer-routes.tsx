/* eslint-disable import/max-dependencies */
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DetailThreadDrawer } from '../drawers/detail-thread-drawer/drawer';
import { EditCommentActionDrawer } from '../drawers/edit-comment-action-drawer/drawer';
import { EditCommentCategoryDrawer } from '../drawers/edit-comment-category-drawer/drawer';
import { EditSpaceDrawer } from '../drawers/edit-space-drawer/drawer';
import { EditThreadCategoryDrawer } from '../drawers/edit-thread-category-drawer/drawer';
import { EditThreadDrawer } from '../drawers/edit-thread-drawer/drawer';
import { ManageCommentCategoryDrawer } from '../drawers/manage-comment-category-drawer/drawer';
import { ManageCommentCategoryMembersDrawer } from '../drawers/manage-comment-category-members-drawer/drawer';
import { ManageThreadCategoryDrawer } from '../drawers/manage-thread-category-drawer/drawer';
import { ManageThreadCategoryMembersDrawer } from '../drawers/manage-thread-category-members-drawer/drawer';
import { NewCommentActionDrawer } from '../drawers/new-comment-action-drawer/drawer';
import { NewCommentCategoryDrawer } from '../drawers/new-comment-category-drawer/drawer';
import { NewSpaceDrawer } from '../drawers/new-space-drawer/drawer';
import { NewThreadCategoryDrawer } from '../drawers/new-thread-category-drawer/drawer';
import { NewThreadDrawer } from '../drawers/new-thread-drawer/drawer';
import { SelectMultipleThreadCategoryDrawer } from '../drawers/select-multiple-thread-category-drawer/drawer';
import { SelectSingleThreadCategoryDrawer } from '../drawers/select-single-thread-category-drawer/drawer';

interface DrawerParams {
  appId?: string;
  spaceId?: number;
  threadId?: number;
  threadCategoryId?: number;
  commentId?: number;
  commentActionId?: number;
  commentCategoryId?: number;
  parentCommentId?: number;
  actionId?: number;
  actionLinkId?: number;
  payloadId?: string;
  tabId?: string;
}

interface DrawerState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, state, closeDrawer } = useDrawerRoute<DrawerParams, DrawerState>();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer} size={isDesktop ? 'lg' : 'full'}>
      {is(DRAWER_ROUTES.NEW_SPACE) && <NewSpaceDrawer />}
      {is(DRAWER_ROUTES.EDIT_SPACE) && hasParam('spaceId') && <EditSpaceDrawer spaceId={params.spaceId!} />}
      {is(DRAWER_ROUTES.NEW_THREAD) && hasParam('spaceId') && (
        <NewThreadDrawer spaceId={params.spaceId!} payload={state?.payload} />
      )}
      {is(DRAWER_ROUTES.DETAIL_THREAD) && hasParam('spaceId') && hasParam('threadId') && (
        <DetailThreadDrawer
          threadId={params.threadId!}
          spaceId={params.spaceId!}
          parentCommentId={params?.parentCommentId ?? null}
          tabId={params?.tabId}
        />
      )}
      {is(DRAWER_ROUTES.EDIT_THREAD) && hasParam('spaceId') && hasParam('threadId') && (
        <EditThreadDrawer threadId={params.threadId!} spaceId={params.spaceId!} payload={state?.payload} />
      )}
      {is(DRAWER_ROUTES.NEW_THREAD_CATEGORY) && <NewThreadCategoryDrawer />}
      {is(DRAWER_ROUTES.EDIT_THREAD_CATEGORY) && hasParam('threadCategoryId') && (
        <EditThreadCategoryDrawer threadCategoryId={params.threadCategoryId!} />
      )}
      {is(DRAWER_ROUTES.MANAGE_THREAD_CATEGORIES) && hasParam('threadCategoryId') && (
        <ManageThreadCategoryDrawer threadCategoryId={params.threadCategoryId!} />
      )}
      {is(DRAWER_ROUTES.MANAGE_THREAD_CATEGORY_MEMBERS) && hasParam('threadCategoryId') && (
        <ManageThreadCategoryMembersDrawer threadCategoryId={params.threadCategoryId!} />
      )}

      {is(DRAWER_ROUTES.NEW_COMMENT_ACTION) && hasParam('threadId') && hasParam('commentId') && (
        <NewCommentActionDrawer threadId={params.threadId!} commentId={params.commentId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_COMMENT_ACTION) && hasParam('commentId') && hasParam('commentActionId') && (
        <EditCommentActionDrawer commentId={params.commentId!} commentActionId={params.commentActionId!} />
      )}
      {is(DRAWER_ROUTES.NEW_COMMENT_CATEGORY) && <NewCommentCategoryDrawer />}
      {is(DRAWER_ROUTES.EDIT_COMMENT_CATEGORY) && hasParam('commentCategoryId') && (
        <EditCommentCategoryDrawer commentCategoryId={params.commentCategoryId!} />
      )}
      {is(DRAWER_ROUTES.MANAGE_COMMENT_CATEGORIES) && hasParam('commentCategoryId') && (
        <ManageCommentCategoryDrawer commentCategoryId={params.commentCategoryId!} />
      )}
      {is(DRAWER_ROUTES.MANAGE_COMMENT_CATEGORY_MEMBERS) && hasParam('commentCategoryId') && (
        <ManageCommentCategoryMembersDrawer commentCategoryId={params.commentCategoryId!} />
      )}

      {is(DRAWER_ROUTES.SELECT_SINGLE_THREAD_CATEGORY) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectSingleThreadCategoryDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.SELECT_MULTIPLE_THREAD_CATEGORIES) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectMultipleThreadCategoryDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
    </Drawer>
  );
};

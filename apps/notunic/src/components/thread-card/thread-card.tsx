import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Badge, BadgeGroup, ButtonIcon, ButtonMenuIcon, CardProps, Text } from '@dimasbaguspm/versaur';
import { sortBy } from 'lodash';
import { Edit2Icon, EllipsisVerticalIcon, ReplyIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

interface ThreadCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  thread: ThreadModel;
  onClick?: (thread: ThreadModel) => void;
  hideAction?: boolean;
  hideDescription?: boolean;
  hideCommentsBadge?: boolean;
  hideCategories?: boolean;
}

export const ThreadCard: FC<ThreadCardProps> = (props) => {
  const { thread, hideDescription, hideAction, hideCommentsBadge, hideCategories, onClick } = props;
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();
  const { description, createdDateTime, title, hasComments, commentsText } = formatNotunicThread(thread);

  const handleClick = () => {
    onClick?.(thread);
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_THREAD, { threadId: thread.id, spaceId: thread.spaceId });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_THREAD, { threadId: thread.id, spaceId: thread.spaceId });
  };

  const handleReplyClick = () => {
    openDrawer(DRAWER_ROUTES.DETAIL_THREAD, { threadId: thread.id, spaceId: thread.spaceId });
  };

  const sortedCategories = sortBy(thread.categories, (category) => category.id);

  return (
    <div className="py-4" onClick={handleClick}>
      <div className="mb-2">
        <div className="flex justify-between w-full">
          <div className="w-full flex items-start gap-3">
            <Text fontWeight="medium" fontSize="base">
              {title}
            </Text>
            <If condition={!hideAction}>
              <div className="flex-grow flex justify-end gap-1">
                <ButtonIcon
                  as={ReplyIcon}
                  size="xs"
                  variant="ghost"
                  aria-label="Reply to thread"
                  onClick={handleReplyClick}
                />
                <ButtonIcon
                  as={Edit2Icon}
                  size="xs"
                  variant="ghost"
                  aria-label="Edit thread"
                  onClick={handleEditClick}
                />
                <ButtonMenuIcon as={EllipsisVerticalIcon} size="xs" variant="ghost" aria-label="More options">
                  <ButtonMenuIcon.Item onClick={handleDeleteClick}>Delete</ButtonMenuIcon.Item>
                </ButtonMenuIcon>
              </div>
            </If>
          </div>
        </div>
      </div>

      <div className="w-full">
        <If condition={!hideDescription}>
          <div className="mb-4">
            <Text color="gray" fontWeight="normal" fontSize="sm">
              {description}
            </Text>
          </div>
        </If>

        <div className="flex flex-col sm:flex-row justify-between">
          <BadgeGroup className="mb-2 sm:mb-0" aria-label="Thread categories">
            <If condition={!hideCategories}>
              {sortedCategories?.map((category) => (
                <Badge key={category.id} color="accent_1" shape="square" size="sm">
                  {category.name}
                </Badge>
              ))}
            </If>
            <If condition={[hasComments, !hideCommentsBadge]}>
              <Badge color="accent_2" shape="square" size="sm">
                {commentsText}
              </Badge>
            </If>
          </BadgeGroup>
          <Text color="gray" fontWeight="normal" fontSize="sm" align="right">
            {createdDateTime}
          </Text>
        </div>
      </div>
    </div>
  );
};

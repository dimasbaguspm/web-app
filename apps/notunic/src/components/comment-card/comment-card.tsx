import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { Anchor, Avatar, ButtonMenuIcon, CardProps, Text } from '@dimasbaguspm/versaur';
import { EllipsisVerticalIcon } from 'lucide-react';
import { FC, MouseEvent } from 'react';

import { MODAL_ROUTES } from '../../constants/modal-routes';

interface CommentCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  variant?: 'compact' | 'detail';
  comment: CommentModel;
  parentComment?: CommentModel | null;
  onReplyClick?: (comment: CommentModel) => void;
  onEditClick?: (comment: CommentModel) => void;
  hideDelete?: boolean;
}

export const CommentCard: FC<CommentCardProps> = (props) => {
  const { comment, hideDelete, variant = 'compact', parentComment, onReplyClick, onEditClick } = props;
  const { openModal } = useModalRoute();

  const { description, createdDateTime, senderName, senderInitial, repliesCount, repliesText } =
    formatNotunicComment(comment);

  const { trimmedDescription } = formatNotunicComment(parentComment);

  const handleReplyClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onReplyClick?.(comment);
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal(MODAL_ROUTES.DELETE_COMMENT, { commentId: comment.id });
  };
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEditClick?.(comment);
  };

  const isCompact = variant === 'compact';

  const showMoreButton = Boolean(onEditClick && !hideDelete);
  return (
    <div className="py-4">
      <div className="flex justify-between w-full">
        <div className="w-full flex items-start gap-3 relative">
          <div className="flex-shrink-0">
            <Avatar shape={isCompact ? 'circle' : 'rounded'} size="sm">
              {senderInitial}
            </Avatar>
          </div>

          <div className="w-full">
            <div className="mb-2">
              <Text fontWeight="semibold" fontSize="base">
                {senderName}
              </Text>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {parentComment && (
                <div className="border border-border rounded-lg p-1.5 flex items-center">
                  <Text color="gray" fontWeight="normal" fontSize="xs">
                    &gt; Replying {trimmedDescription}
                  </Text>
                </div>
              )}
              <Text color="gray" fontWeight="normal" fontSize="sm">
                {description}
              </Text>
            </div>
            <div className={`w-full flex items-end ${onReplyClick ? 'justify-between' : 'justify-end'}`}>
              {onReplyClick && (
                <Anchor
                  color="ghost"
                  fontWeight="normal"
                  fontSize="sm"
                  className="cursor-pointer"
                  onClick={handleReplyClick}
                >
                  {repliesCount ? repliesText : 'Add reply'}
                </Anchor>
              )}

              <Text color="gray" fontWeight="normal" fontSize="sm" align="right">
                {createdDateTime}
              </Text>
            </div>
          </div>
          {showMoreButton && (
            <div className="absolute right-0 flex justify-end">
              <ButtonMenuIcon as={EllipsisVerticalIcon} size="xs" variant="ghost" aria-label="More options">
                {onEditClick && <ButtonMenuIcon.Item onClick={handleEditClick}>Edit</ButtonMenuIcon.Item>}
                <ButtonMenuIcon.Item>Create Task</ButtonMenuIcon.Item>
                {!hideDelete && <ButtonMenuIcon.Item onClick={handleDeleteClick}>Delete</ButtonMenuIcon.Item>}
              </ButtonMenuIcon>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

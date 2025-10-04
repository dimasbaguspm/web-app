import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Anchor, Avatar, ButtonGroup, ButtonMenuIcon, Card, CardProps, Text } from '@dimasbaguspm/versaur';
import { EllipsisVerticalIcon } from 'lucide-react';
import { FC, MouseEvent } from 'react';

interface CommentCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  comment: CommentModel;
  parentComment?: CommentModel | null;
  onReplyClick?: (comment: CommentModel) => void;
  onEditClick?: (comment: CommentModel) => void;
  onDeleteClick?: (comment: CommentModel) => void;
  onAssignActionClick?: (comment: CommentModel) => void;
  onFollowUpActionClick?: (comment: CommentModel) => void;
  hideActions?: boolean;
}

export const CommentCard: FC<CommentCardProps> = (props) => {
  const {
    hideActions,
    comment,
    parentComment,
    onReplyClick,
    onDeleteClick,
    onEditClick,
    onAssignActionClick,
    onFollowUpActionClick,
  } = props;

  const {
    description,
    createdDateTime,
    senderName,
    senderInitial,
    repliesCount,
    repliesText,
    hasAction,
    isActionDone,
  } = formatNotunicComment(comment);

  const { trimmedDescription } = formatNotunicComment(parentComment);

  const handleReplyClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onReplyClick?.(comment);
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteClick?.(comment);
  };
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEditClick?.(comment);
  };

  const handleAssignActionClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onAssignActionClick?.(comment);
  };

  const handleFollowUpActionClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onFollowUpActionClick?.(comment);
  };

  const showMoreButton = Boolean(onEditClick || onDeleteClick || onAssignActionClick);
  return (
    <div className="flex justify-between w-full">
      <div className="w-full flex items-start gap-3 relative">
        <div className="flex-shrink-0">
          <Avatar shape="circle" size="md">
            {senderInitial}
          </Avatar>
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-2">
              <Text fontWeight="semibold" fontSize="base">
                {senderName}
              </Text>
              <Text color="gray" fontWeight="normal" fontSize="xs">
                {createdDateTime}
              </Text>
            </div>
            {showMoreButton && (
              <ButtonGroup gap="xs">
                <ButtonMenuIcon as={EllipsisVerticalIcon} size="xs" variant="ghost" aria-label="More options">
                  {onEditClick && <ButtonMenuIcon.Item onClick={handleEditClick}>Edit</ButtonMenuIcon.Item>}
                  {onDeleteClick && <ButtonMenuIcon.Item onClick={handleDeleteClick}>Delete</ButtonMenuIcon.Item>}
                </ButtonMenuIcon>
              </ButtonGroup>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {parentComment && comment?.parentCommentId && (
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
          <If condition={!hideActions}>
            <div className="w-full flex items-end justify-between">
              <Card.List>
                <If condition={[onReplyClick]}>
                  <Card.ListItem>
                    <Anchor
                      color="ghost"
                      fontWeight="normal"
                      fontSize="sm"
                      className="cursor-pointer"
                      onClick={handleReplyClick}
                    >
                      {repliesCount ? repliesText : 'Add reply'}
                    </Anchor>
                  </Card.ListItem>
                </If>
                <Card.ListItem>
                  <Anchor
                    color="ghost"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={hasAction ? handleFollowUpActionClick : handleAssignActionClick}
                  >
                    {hasAction ? (isActionDone ? 'View' : 'Add') : 'Create'} Follow-up
                  </Anchor>
                </Card.ListItem>
              </Card.List>
            </div>
          </If>
        </div>
      </div>
    </div>
  );
};

import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Anchor, Avatar, ButtonGroup, ButtonMenuIcon, Card, CardProps, Icon, Text } from '@dimasbaguspm/versaur';
import { ClockAlertIcon, EllipsisVerticalIcon, ForwardIcon } from 'lucide-react';
import { FC, MouseEvent } from 'react';

interface CommentCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  comment: CommentModel;
  onReplyClick?: (comment: CommentModel) => void;
  onEditClick?: (comment: CommentModel) => void;
  onDeleteClick?: (comment: CommentModel) => void;
  onAssignActionClick?: (comment: CommentModel) => void;
  onFollowUpActionClick?: (comment: CommentModel) => void;
  hideActions?: boolean;
  hideHorizontalLine?: boolean;
  className?: string;
}

export const CommentCard: FC<CommentCardProps> = (props) => {
  const {
    className,
    hideActions,
    hideHorizontalLine = false,
    comment,
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
    isActionNearDue,
    isActionOverdue,
  } = formatNotunicComment(comment);

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

  const handleAssignActionClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAssignActionClick?.(comment);
  };

  const handleFollowUpActionClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFollowUpActionClick?.(comment);
  };

  const showMoreButton = Boolean(onEditClick || onDeleteClick || onFollowUpActionClick || onAssignActionClick);
  return (
    <div className={`flex justify-between w-full ${className}`}>
      <div className="w-full flex items-start gap-3 relative">
        <div className="flex-shrink-0 flex flex-col items-center h-full">
          <Avatar shape="circle" size="md">
            {senderInitial}
          </Avatar>
          {!hideHorizontalLine && <div className="flex-grow border-l border-border" />}
        </div>

        <div className="w-full mb-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Text fontWeight="semibold" fontSize="sm">
                {senderName}
              </Text>
              {hasAction && (
                <Icon
                  as={isActionDone ? ForwardIcon : ClockAlertIcon}
                  size="sm"
                  color={isActionOverdue ? 'danger' : isActionNearDue ? 'warning' : 'ghost'}
                />
              )}
              <Text color="gray" fontWeight="normal" fontSize="xs">
                {createdDateTime}
              </Text>
            </div>
            {showMoreButton && (
              <ButtonGroup gap="xs">
                <ButtonMenuIcon as={EllipsisVerticalIcon} size="sm" variant="ghost" aria-label="More options">
                  {onEditClick && <ButtonMenuIcon.Item onClick={handleEditClick}>Edit</ButtonMenuIcon.Item>}
                  <ButtonMenuIcon.Item onClick={hasAction ? handleFollowUpActionClick : handleAssignActionClick}>
                    {hasAction ? (isActionDone ? 'View' : 'Add') : 'Create'} Follow-up
                  </ButtonMenuIcon.Item>
                  {onDeleteClick && <ButtonMenuIcon.Item onClick={handleDeleteClick}>Delete</ButtonMenuIcon.Item>}
                </ButtonMenuIcon>
              </ButtonGroup>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <Text color="gray" fontWeight="normal" fontSize="base" className="whitespace-pre-wrap">
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
              </Card.List>
            </div>
          </If>
        </div>
      </div>
    </div>
  );
};

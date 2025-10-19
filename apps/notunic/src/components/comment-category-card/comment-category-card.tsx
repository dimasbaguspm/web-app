import { CommentCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicCommentCategory } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CommentCategoryCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  commentCategory: CommentCategoryModel;
  onClick?: (commentCategory: CommentCategoryModel) => void;
}

export const CommentCategoryCard: FC<CommentCategoryCardProps> = (props) => {
  const { commentCategory, onClick, ...rest } = props;
  const { name, initial, createdDateTime } = formatNotunicCommentCategory(commentCategory);

  const handleClick = () => {
    onClick?.(commentCategory);
  };

  return (
    <Card
      onClick={handleClick}
      title={name}
      avatar={<Avatar shape="rounded">{initial}</Avatar>}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};

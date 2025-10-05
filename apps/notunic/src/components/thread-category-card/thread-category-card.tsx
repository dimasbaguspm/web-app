import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicThreadCategory } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ThreadCategoryCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  threadCategory: ThreadCategoryModel;
  onClick?: (threadCategory: ThreadCategoryModel) => void;
}

export const ThreadCategoryCard: FC<ThreadCategoryCardProps> = (props) => {
  const { threadCategory, onClick, ...rest } = props;
  const { name, initialName, createdDateTime } = formatNotunicThreadCategory(threadCategory);

  const handleClick = () => {
    onClick?.(threadCategory);
  };

  return (
    <Card
      onClick={handleClick}
      title={name}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};

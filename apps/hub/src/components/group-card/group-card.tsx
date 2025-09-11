import { GroupModel } from '@dimasbaguspm/interfaces';
import { formatHiGroup } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface GroupCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  group: GroupModel;
  onClick?: (group: GroupModel) => void;
}

export const GroupCard: FC<GroupCardProps> = (props) => {
  const { group, onClick, ...rest } = props;

  const { name, initialName, createdDateTime } = formatHiGroup(group);

  const handleClick = () => {
    onClick?.(group);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      title={name}
      supplementaryInfo={createdDateTime}
      {...rest}
    />
  );
};

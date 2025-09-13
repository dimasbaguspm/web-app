import { UserModel } from '@dimasbaguspm/interfaces';
import { formatHiUserData } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface UserCardProps
  extends Partial<Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo' | 'badge'>> {
  user: UserModel;
  onClick?: (user: UserModel) => void;
}

export const UserCard: FC<UserCardProps> = (props) => {
  const { user, onClick, ...rest } = props;

  const { name, initial, createdDateTime } = formatHiUserData(user);

  const handleClick = () => {
    onClick?.(user);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initial}</Avatar>}
      title={name}
      supplementaryInfo={createdDateTime}
      {...rest}
    />
  );
};

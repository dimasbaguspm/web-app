import { AccountGroupModel } from '@dimasbaguspm/interfaces';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Card, CardProps, Icon, Text } from '@dimasbaguspm/versaur';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

interface AccountGroupCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered'> {
  accountGroup: AccountGroupModel;
  onClick?: (accountGroup: AccountGroupModel) => void;
}

export const AccountGroupCard: FC<AccountGroupCardProps> = ({ accountGroup, onClick, ...props }) => {
  const accountCount = accountGroup.memberIds.length;

  return (
    <Card
      {...props}
      onClick={() => onClick?.(accountGroup)}
      avatar={
        <Avatar shape="rounded" size="lg">
          {nameToInitials(accountGroup.name)}
        </Avatar>
      }
      title={accountGroup.name}
      subtitle={
        <Card.List>
          <Card.ListItem>
            <Icon as={UsersIcon} size="sm" color="gray" className="mr-2" />
            <Text as="small" color="gray">
              {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
            </Text>
          </Card.ListItem>
        </Card.List>
      }
    />
  );
};

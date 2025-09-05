import { AccountGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Card, Icon, Text } from '@dimasbaguspm/versaur';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface AccountGroupCardProps {
  accountGroup: AccountGroupModel;
}

export const AccountGroupCard: FC<AccountGroupCardProps> = ({ accountGroup }) => {
  const { openDrawer } = useDrawerRoute();

  const handleOnCardClick = () => {
    openDrawer(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP, { accountGroupId: accountGroup.id });
  };

  const accountCount = accountGroup.memberIds.length;

  return (
    <Card
      onClick={handleOnCardClick}
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
            <Text fontSize="sm" color="gray">
              {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
            </Text>
          </Card.ListItem>
        </Card.List>
      }
    />
  );
};

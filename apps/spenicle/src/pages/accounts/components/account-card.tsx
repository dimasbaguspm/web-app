import { AccountModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Badge, BadgeGroup, Card, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AccountCardProps {
  account: AccountModel;
  onClick?: (account: AccountModel) => void;
}

export const AccountCard: FC<AccountCardProps> = ({ account, onClick }) => {
  const { formattedAmount, type, variant } = formatSpenicleAccount(account);

  const handleClick = () => {
    onClick?.(account);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{nameToInitials(account.name)}</Avatar>}
      title={account.name}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{type}</Badge>
        </BadgeGroup>
      }
      supplementaryInfo={
        <Text fontSize="sm" color="gray">
          {formattedAmount}
        </Text>
      }
    />
  );
};

import { AccountModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Badge, BadgeGroup, Card, CardProps, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AccountCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered'> {
  account: AccountModel;
  onClick?: (account: AccountModel) => void;
}

export const AccountCard: FC<AccountCardProps> = (props) => {
  const { account, onClick, ...rest } = props;
  const { formattedAmount, type, variant, hasGroup, groups } = formatSpenicleAccount(account);

  const handleClick = () => {
    onClick?.(account);
  };

  return (
    <Card
      {...rest}
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{nameToInitials(account.name)}</Avatar>}
      title={account.name}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{type}</Badge>
          <If condition={hasGroup}>
            {groups.map(({ name }) => (
              <Badge key={name} color="accent_1">
                {name}
              </Badge>
            ))}
          </If>
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

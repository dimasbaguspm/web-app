import { AccountModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AccountCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  account: AccountModel;
  onClick?: (account: AccountModel) => void;
}

export const AccountCard: FC<AccountCardProps> = (props) => {
  const { account, onClick, ...rest } = props;
  const { formattedAmount, name, initialName, type, variant, hasGroup, groups } = formatSpenicleAccount(account);

  const handleClick = () => {
    onClick?.(account);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      title={name}
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
      supplementaryInfo={formattedAmount}
      {...rest}
    />
  );
};

import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount, formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface TransactionCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'actions'> {
  transaction: TransactionModel;
  category: CategoryModel | undefined;
  account: AccountModel | undefined;
  onClick: (transaction: TransactionModel) => void;
  useDateTime?: boolean;
}

export const TransactionCard: FC<TransactionCardProps> = ({ transaction, category, account, onClick, useDateTime }) => {
  const { trimmedNotes, variant, capitalizedType, dateTime, time } = formatSpenicleTransaction(transaction);
  const { name: categoryName, groups: categoryGroups, hasGroup: hasCategoryGroup } = formatSpenicleCategory(category);
  const {
    name: accountName,
    groups: accountGroups,
    hasGroup: hasAccountGroup,
    initialName: accountInitialName,
  } = formatSpenicleAccount(account);

  return (
    <Card
      title={formatPrice(transaction.amount)}
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{accountInitialName}</Avatar>}
      subtitle={
        <Card.List>
          <Card.ListItem>{accountName}</Card.ListItem>
          <Card.ListItem>{categoryName}</Card.ListItem>
          <Card.ListItem>{trimmedNotes}</Card.ListItem>
        </Card.List>
      }
      supplementaryInfo={useDateTime ? dateTime : time}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
          <If condition={hasAccountGroup}>
            {accountGroups.map(({ name }) => (
              <Badge key={name} color="accent_1">
                {name}
              </Badge>
            ))}
          </If>
          <If condition={hasCategoryGroup}>
            {categoryGroups.map(({ name }) => (
              <Badge key={name} color="accent_2">
                {name}
              </Badge>
            ))}
          </If>
        </BadgeGroup>
      }
    />
  );
};

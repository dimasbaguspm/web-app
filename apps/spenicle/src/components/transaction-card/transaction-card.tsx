import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount, formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, CardProps, Icon } from '@dimasbaguspm/versaur';
import { RefreshCwIcon } from 'lucide-react';
import { FC } from 'react';

interface TransactionCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered'> {
  transaction: TransactionModel;
  category: CategoryModel | undefined;
  account: AccountModel | undefined;
  destinationAccount?: AccountModel | undefined;
  onClick: (transaction: TransactionModel) => void;
  useDateTime?: boolean;
}

export const TransactionCard: FC<TransactionCardProps> = ({
  transaction,
  category,
  account,
  destinationAccount,
  onClick,
  useDateTime,
  ...props
}) => {
  const { variant, capitalizedType, dateTime, time, trimmedNotes, isScheduled, isTransfer } =
    formatSpenicleTransaction(transaction);
  const { name: categoryName, groups: categoryGroups, hasGroup: hasCategoryGroup } = formatSpenicleCategory(category);
  const {
    name: accountName,
    groups: accountGroups,
    hasGroup: hasAccountGroup,
    initialName: accountInitialName,
  } = formatSpenicleAccount(account);
  const { name: destinationAccountName } = formatSpenicleAccount(destinationAccount);

  return (
    <Card
      {...props}
      title={
        <div className="flex items-center">
          {formatPrice(transaction.amount)}
          <If condition={isScheduled}>
            <Icon as={RefreshCwIcon} size="sm" color="gray" className="ml-2" aria-label="Scheduled transaction" />
          </If>
        </div>
      }
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{accountInitialName}</Avatar>}
      subtitle={
        <Card.List>
          <If condition={isTransfer}>
            <Card.ListItem>
              {accountName} to {destinationAccountName}
            </Card.ListItem>
          </If>
          <If condition={!isTransfer}>
            <Card.ListItem>{accountName}</Card.ListItem>
          </If>
          <Card.ListItem>{categoryName}</Card.ListItem>
          <If condition={!!trimmedNotes.length}>
            <Card.ListItem>{trimmedNotes}</Card.ListItem>
          </If>
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

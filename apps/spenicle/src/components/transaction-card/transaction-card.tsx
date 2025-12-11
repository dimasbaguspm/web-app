import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount, formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
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
  hideAccountSubtitle?: boolean;
  hideAccountGroup?: boolean;
  hideCategorySubtitle?: boolean;
  hideCategoryGroup?: boolean;
  hideNotesSubtitle?: boolean;
}

export const TransactionCard: FC<TransactionCardProps> = ({
  transaction,
  category,
  account,
  destinationAccount,
  onClick,
  useDateTime,
  hideAccountSubtitle,
  hideAccountGroup,
  hideCategorySubtitle,
  hideCategoryGroup,
  hideNotesSubtitle,
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
      avatar={<Avatar shape="rounded">{accountInitialName || nameToInitials(transaction.account.name)}</Avatar>}
      subtitle={
        <Card.List>
          <If condition={[isTransfer, !hideAccountSubtitle]}>
            <Card.ListItem>
              {accountName || transaction.account.name} to{' '}
              {destinationAccountName || transaction.destinationAccount?.name}
            </Card.ListItem>
          </If>
          <If condition={[!isTransfer, !hideAccountSubtitle]}>
            <Card.ListItem>{accountName || transaction.account.name}</Card.ListItem>
          </If>
          <If condition={[!hideCategorySubtitle]}>
            <Card.ListItem>{categoryName || transaction.category.name}</Card.ListItem>
          </If>
          <If condition={[!!trimmedNotes.length, !hideNotesSubtitle]}>
            <Card.ListItem>{trimmedNotes}</Card.ListItem>
          </If>
        </Card.List>
      }
      supplementaryInfo={useDateTime ? dateTime : time}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
          <If condition={[hasAccountGroup && !hideAccountGroup]}>
            {accountGroups.map(({ name }) => (
              <Badge key={name} color="accent_1">
                {name}
              </Badge>
            ))}
          </If>
          <If condition={[hasCategoryGroup && !hideCategoryGroup]}>
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

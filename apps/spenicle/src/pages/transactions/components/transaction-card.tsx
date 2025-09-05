import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleAccount, formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface TransactionCardProps {
  transaction: TransactionModel;
  category: CategoryModel | undefined;
  account: AccountModel | undefined;
  onClick: (transaction: TransactionModel) => void;
}

export const TransactionCard: FC<TransactionCardProps> = ({ transaction, category, account, onClick }) => {
  const { trimmedNotes, variant, capitalizedType } = formatSpenicleTransaction(transaction);
  const { capitalizedName } = formatSpenicleCategory(category);
  const { initialName: accountInitialName, name: accountName } = formatSpenicleAccount(account);

  return (
    <Card
      title={formatPrice(transaction.amount)}
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{accountInitialName}</Avatar>}
      subtitle={
        <Card.List>
          <Card.ListItem>{capitalizedName}</Card.ListItem>
          <Card.ListItem>{trimmedNotes}</Card.ListItem>
        </Card.List>
      }
      supplementaryInfo={formatDate(transaction.date, DateFormat.TIME_24H)}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
          <Badge color="info">{accountName}</Badge>
        </BadgeGroup>
      }
    />
  );
};

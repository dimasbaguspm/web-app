import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface SummaryTimelineCardProps {
  transaction: TransactionModel;
  category: CategoryModel;
  account: AccountModel;
  onClick: (transaction: TransactionModel) => void;
}

export const SummaryTimelineCard: FC<SummaryTimelineCardProps> = ({ transaction, category, account, onClick }) => {
  const { trimmedNotes, variant, capitalizedType } = formatSpenicleTransaction(transaction);
  const { capitalizedName } = formatSpenicleCategory(category);

  return (
    <Card
      title={formatPrice(transaction.amount)}
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{nameToInitials(account?.name ?? '')}</Avatar>}
      subtitle={
        <Card.List>
          <Card.ListItem>{capitalizedName}</Card.ListItem>
          <Card.ListItem>{trimmedNotes}</Card.ListItem>
        </Card.List>
      }
      supplementaryInfo={formatDate(transaction.date, DateFormat.SHORT_DATETIME)}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
        </BadgeGroup>
      }
    />
  );
};

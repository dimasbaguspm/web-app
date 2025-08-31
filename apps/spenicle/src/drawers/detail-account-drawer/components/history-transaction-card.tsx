import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface HistoryTransactionCardProps {
  transaction: TransactionModel;
  category: CategoryModel;
  account: AccountModel;
  onClick: (transaction: TransactionModel) => void;
}

export const HistoryTransactionCard: FC<HistoryTransactionCardProps> = ({
  transaction,
  category,
  account,
  onClick,
}) => {
  const { trimmedNotes, variant, capitalizedType } = formatSpenicleTransaction(transaction);
  const { capitalizedName } = formatSpenicleCategory(category);

  return (
    <Card
      title={formatPrice(transaction.amount)}
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{nameToInitials(account?.name ?? '')}</Avatar>}
      subtitle={trimmedNotes}
      supplementaryInfo={
        <Text color="gray" fontSize="sm">
          {formatDate(transaction.date, DateFormat.SHORT_DATETIME)}
        </Text>
      }
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
          <Badge color="ghost">{capitalizedName}</Badge>
        </BadgeGroup>
      }
    />
  );
};

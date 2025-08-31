import { AccountModel, CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, Text } from '@dimasbaguspm/versaur';
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

  return (
    <Card
      title={formatPrice(transaction.amount)}
      onClick={() => onClick(transaction)}
      avatar={<Avatar shape="rounded">{nameToInitials(account?.name ?? '')}</Avatar>}
      subtitle={trimmedNotes}
      supplementaryInfo={
        <Text color="gray" fontSize="sm">
          {formatDate(transaction.date, DateFormat.TIME_24H)}
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

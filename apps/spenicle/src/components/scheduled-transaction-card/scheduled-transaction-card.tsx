import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleScheduledTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ScheduledTransactionCardProps
  extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  scheduledTransaction: ScheduledTransactionModel;
  isInstallment?: boolean;
  onClick?: (scheduledTransaction: ScheduledTransactionModel) => void;
}

export const ScheduledTransactionCard: FC<ScheduledTransactionCardProps> = ({
  scheduledTransaction,
  isInstallment = false,
  onClick,
  ...cardProps
}) => {
  const {
    name,
    isCompleted,
    isActive,
    humanizedFrequency,
    isPending,
    variant,
    capitalizedType,
    capitalizedStatus,
    amount,
    nextRunDateTime,
    installmentProgress,
    pastOccurrences,
  } = formatSpenicleScheduledTransaction(scheduledTransaction);

  const handleClick = () => {
    onClick?.(scheduledTransaction);
  };

  return (
    <Card
      onClick={handleClick}
      title={amount}
      subtitle={
        <Card.List>
          <Card.ListItem>{name}</Card.ListItem>
          <Card.ListItem>{humanizedFrequency}</Card.ListItem>
          <If condition={[isInstallment, installmentProgress]}>
            <Card.ListItem>{installmentProgress} Installments</Card.ListItem>
          </If>
          <If condition={[!isInstallment]}>
            <Card.ListItem>{pastOccurrences ? `${pastOccurrences} Occurrences` : 'No Occurrences'}</Card.ListItem>
          </If>
        </Card.List>
      }
      badge={
        <BadgeGroup>
          <Badge color={variant}>{capitalizedType}</Badge>
          <Badge color={isCompleted ? 'accent_3' : isActive ? 'accent_2' : 'accent_1'}>{capitalizedStatus}</Badge>
        </BadgeGroup>
      }
      supplementaryInfo={isPending ? 'On queue' : `Next occurrence ${nextRunDateTime}`}
      {...cardProps}
    />
  );
};

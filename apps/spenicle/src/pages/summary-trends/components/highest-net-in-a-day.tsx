import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface HighestNetInADayProps {
  data: SummaryTransactionsModel;
}

export const HighestNetInADay: FC<HighestNetInADayProps> = ({ data }) => {
  const organisedData = data?.reduce((a, b) =>
    Number(b.net) > Number(a.net) ? b : a,
  );

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Highest net in a day
      </Text>
      <If condition={organisedData?.totalTransactions}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatPrice(organisedData.net)}
        </Text>
        <Text fontSize="xs" color="gray">
          Income: {formatPrice(organisedData.income)} • Expense:{' '}
          {formatPrice(organisedData.expense)}
        </Text>
      </If>
      <If condition={!organisedData?.totalTransactions}>
        <Text fontWeight="semibold" fontSize="lg">
          No activity recorded
        </Text>
      </If>
    </Tile>
  );
};

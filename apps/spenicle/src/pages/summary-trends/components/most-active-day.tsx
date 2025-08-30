import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface MostActiveDayProps {
  data: SummaryTransactionsModel;
}

export const MostActiveDay: FC<MostActiveDayProps> = ({ data }) => {
  const organisedData = data?.reduce((a, b) =>
    Number(b?.totalTransactions) > Number(a?.totalTransactions) ? b : a,
  );

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Most active day
      </Text>
      <If condition={organisedData?.totalTransactions}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatDate(organisedData?.date, DateFormat.WEEKDAY_DATE)}
        </Text>
        <Text fontSize="xs" color="gray">
          {organisedData?.totalTransactions} transactions
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

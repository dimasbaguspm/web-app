import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { NoResults, Text, Tile } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface MostActiveDayProps {
  data: SummaryTransactionsModel;
}

export const MostActiveDay: FC<MostActiveDayProps> = ({ data }) => {
  const organisedData = data?.reduce((a, b) =>
    Number(b?.totalTransactions) > Number(a?.totalTransactions) ? b : a,
  );

  return (
    <>
      <If condition={[organisedData?.totalTransactions]}>
        <Tile>
          <Text fontSize="base">Most active</Text>
          <div className="mt-2">
            <Text fontSize="sm">
              {formatDate(organisedData.date, DateFormat.WEEKDAY_DATE)}
            </Text>

            <div className="flex flex-row justify-between">
              <Text color="tertiary" fontWeight="medium">
                {organisedData.totalTransactions} transactions
              </Text>

              <Text fontSize="xs" color="gray">
                Net: {formatPrice(organisedData.net)}
              </Text>
            </div>
          </div>
        </Tile>
      </If>
      <If condition={!organisedData.totalTransactions}>
        <NoResults title="No data available" icon={SearchXIcon} />
      </If>
    </>
  );
};

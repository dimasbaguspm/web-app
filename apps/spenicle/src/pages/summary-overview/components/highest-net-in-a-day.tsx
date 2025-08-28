import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { NoResults, Text, Tile } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface HighestNetInADayProps {
  data: SummaryTransactionsModel;
}

export const HighestNetInADay: FC<HighestNetInADayProps> = ({ data }) => {
  const organisedData = data?.reduce((a, b) =>
    Number(b.net) > Number(a.net) ? b : a,
  );

  return (
    <>
      <If condition={organisedData.net}>
        <Tile>
          <Text fontSize="base">Highest Net</Text>
          <div className="mt-2">
            <Text fontSize="sm">
              {formatDate(organisedData.date, DateFormat.WEEKDAY_DATE)}
            </Text>

            <div className="flex flex-row justify-between">
              <Text
                color={organisedData.net >= 0 ? 'secondary' : 'primary'}
                fontWeight="medium"
              >
                {formatPrice(organisedData.net)}
              </Text>

              <Text fontSize="xs" color="gray">
                Income: {formatPrice(organisedData.income)} • Expense:{' '}
                {formatPrice(organisedData.expense)}
              </Text>
            </div>
          </div>
        </Tile>
      </If>
      <If condition={!organisedData.net}>
        <NoResults title="No data available" icon={SearchXIcon} />
      </If>
    </>
  );
};

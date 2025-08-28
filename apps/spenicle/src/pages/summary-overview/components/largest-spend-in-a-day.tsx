import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { NoResults, Text, Tile } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface LargestSpendInADayProps {
  data: SummaryTransactionsModel;
}

export const LargestSpendInADay: FC<LargestSpendInADayProps> = ({ data }) => {
  const largestSpendDay = data?.reduce((a, b) =>
    Number(b.expense) > Number(a.expense) ? b : a,
  );

  return (
    <>
      <If condition={largestSpendDay.expense}>
        <Tile>
          <Text fontSize="base">Largest spend</Text>
          <div className="mt-2">
            <Text fontSize="sm">
              {formatDate(largestSpendDay.date, DateFormat.WEEKDAY_DATE)}
            </Text>

            <div className="flex flex-row justify-between">
              <Text color="primary" fontWeight="medium">
                {formatPrice(largestSpendDay.expense)}
              </Text>

              <Text fontSize="xs" color="gray">
                {largestSpendDay.totalTransactions} transactions
              </Text>
            </div>
          </div>
        </Tile>
      </If>
      <If condition={!largestSpendDay.expense}>
        <NoResults title="No data available" icon={SearchXIcon} />
      </If>
    </>
  );
};

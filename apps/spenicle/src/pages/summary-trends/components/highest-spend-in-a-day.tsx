import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface HighestSpendInADayProps {
  data: SummaryTransactionsModel;
}

export const HighestSpendInADay: FC<HighestSpendInADayProps> = ({ data }) => {
  const largestSpendDay = data?.reduce((a, b) =>
    Number(b.expense) > Number(a.expense) ? b : a,
  );

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Highest spend in a day
      </Text>
      <If condition={largestSpendDay.expense}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatPrice(largestSpendDay.expense)}
        </Text>
        <Text fontSize="xs" color="gray">
          {formatDate(largestSpendDay.date, DateFormat.WEEKDAY_DATE)}
        </Text>
      </If>
      <If condition={!largestSpendDay.expense}>
        <Text fontWeight="semibold" fontSize="lg">
          No spend recorded
        </Text>
      </If>
    </Tile>
  );
};

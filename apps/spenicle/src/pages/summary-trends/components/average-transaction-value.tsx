import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Currency, formatPrice } from '@dimasbaguspm/utils/price';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC, useMemo } from 'react';

interface AverageTransactionValueProps {
  data: SummaryTransactionsModel;
}

export const AverageTransactionValue: FC<AverageTransactionValueProps> = ({
  data,
}) => {
  const averageValue = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        value: 0,
        totalTransactions: 0,
      };
    }

    // Filter to only periods with actual transactions
    const activePeriods = data.filter((item) => item.totalTransactions > 0);

    if (activePeriods.length === 0) {
      return {
        value: 0,
        totalTransactions: 0,
      };
    }

    const totalNet = activePeriods.reduce((sum, item) => sum + item.net, 0);
    const totalTransactions = activePeriods.reduce(
      (sum, item) => sum + item.totalTransactions,
      0,
    );

    return {
      value: totalTransactions > 0 ? totalNet / totalTransactions : 0,
      totalTransactions,
    };
  }, [data]);

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Average transaction value
      </Text>
      <If condition={averageValue.totalTransactions > 0}>
        <Text fontWeight="semibold" fontSize="lg">
          {formatPrice(averageValue.value, Currency.IDR, { compact: true })}
        </Text>
        <Text fontSize="xs" color="gray">
          Net per transaction
        </Text>
      </If>
      <If condition={averageValue.totalTransactions === 0}>
        <Text fontWeight="semibold" fontSize="lg">
          No transactions
        </Text>
      </If>
    </Tile>
  );
};

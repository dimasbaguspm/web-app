import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Text, Tile } from '@dimasbaguspm/versaur';
import { FC, useMemo } from 'react';

interface AverageLoggedTransactionProps {
  data: SummaryTransactionsModel;
}

export const AverageLoggedTransaction: FC<AverageLoggedTransactionProps> = ({
  data,
}) => {
  const averageTransactions = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        daily: 0,
        totalDays: 0,
        activeDays: 0,
      };
    }

    // Filter to only days with actual transactions
    const activeDays = data.filter((item) => item.totalTransactions > 0);

    const totalTransactions = data.reduce(
      (sum, item) => sum + item.totalTransactions,
      0,
    );
    const totalDays = data.length;
    const activeDaysCount = activeDays.length;

    return {
      daily: activeDaysCount > 0 ? totalTransactions / activeDaysCount : 0,
      totalDays,
      activeDays: activeDaysCount,
    };
  }, [data]);

  return (
    <Tile className="flex flex-col gap-1">
      <Text fontWeight="medium" fontSize="sm" color="gray">
        Average daily transactions
      </Text>
      <If condition={averageTransactions.activeDays > 0}>
        <Text fontWeight="semibold" fontSize="lg">
          {averageTransactions.daily.toFixed(1)}
        </Text>
        <Text fontSize="xs" color="gray">
          Per active day
        </Text>
      </If>
      <If condition={averageTransactions.activeDays === 0}>
        <Text fontWeight="semibold" fontSize="lg">
          No transactions
        </Text>
      </If>
    </Tile>
  );
};

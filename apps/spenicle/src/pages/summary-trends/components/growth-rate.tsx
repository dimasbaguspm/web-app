import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGrowthSummaryStats } from '../../../hooks/use-growth-summary-stats';

interface GrowthRateProps {
  data: SummaryTransactionsModel;
}

export const GrowthRate: FC<GrowthRateProps> = ({ data }) => {
  const growthStats = useGrowthSummaryStats(data, {
    metric: 'net',
  });

  return (
    <Tile className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Text fontWeight="medium" fontSize="sm" color="gray">
          Growth rate
        </Text>
        <Icon
          as={growthStats.TrendIcon}
          size="xs"
          color={growthStats.getTrendColor(false)}
        />
      </div>
      <If condition={data && data.length > 1}>
        <Text fontWeight="semibold" fontSize="lg">
          {growthStats.formattedPercentage}
        </Text>
        <Text fontSize="xs" color="gray">
          Average period growth
        </Text>
      </If>
      <If condition={!data || data.length <= 1}>
        <Text fontWeight="semibold" fontSize="lg">
          No data available
        </Text>
      </If>
    </Tile>
  );
};

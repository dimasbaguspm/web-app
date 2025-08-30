import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

interface GrowthRateProps {
  data: SummaryTransactionsModel;
}

export const GrowthRate: FC<GrowthRateProps> = ({ data }) => {
  const growthStats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        growthPercentage: 0,
        trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
      };
    }

    // Filter to only periods with actual activity (non-zero net)
    const activePeriods = data.filter((period) => period.net !== 0);

    // Calculate growth rate based on actual transaction periods
    let totalGrowthPercentage = 0;
    let validComparisons = 0;

    if (activePeriods.length >= 2) {
      // Calculate growth between actual transaction periods
      for (let i = 1; i < activePeriods.length; i++) {
        const previousNet = activePeriods[i - 1].net;
        const currentNet = activePeriods[i].net;

        // Calculate period-over-period growth
        const periodGrowth =
          ((currentNet - previousNet) / Math.abs(previousNet)) * 100;
        totalGrowthPercentage += periodGrowth;
        validComparisons++;
      }
    } else if (activePeriods.length === 1) {
      // Only one active period - compare against zero baseline
      const singleNet = activePeriods[0].net;
      if (singleNet > 0) {
        totalGrowthPercentage = 100; // Positive growth from zero
      } else {
        totalGrowthPercentage = -100; // Negative growth from zero
      }
      validComparisons = 1;
    }

    // Calculate average growth rate
    const averageGrowthPercentage =
      validComparisons > 0 ? totalGrowthPercentage / validComparisons : 0;

    // Determine trend direction
    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
    if (averageGrowthPercentage > 5) {
      trendDirection = 'up';
    } else if (averageGrowthPercentage < -5) {
      trendDirection = 'down';
    }

    return {
      growthPercentage: averageGrowthPercentage,
      trendDirection,
    };
  }, [data]);

  const trendIcon = useMemo(() => {
    switch (growthStats.trendDirection) {
      case 'up':
        return TrendingUpIcon;
      case 'down':
        return TrendingDownIcon;
      default:
        return MinusIcon;
    }
  }, [growthStats.trendDirection]);

  const trendColor = useMemo(() => {
    switch (growthStats.trendDirection) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      default:
        return 'gray';
    }
  }, [growthStats.trendDirection]);

  return (
    <Tile className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Text fontWeight="medium" fontSize="sm" color="gray">
          Growth rate
        </Text>
        <Icon as={trendIcon} size="xs" color={trendColor} />
      </div>
      <If condition={data && data.length > 1}>
        <Text fontWeight="semibold" fontSize="lg">
          {growthStats.growthPercentage > 0 ? '+' : ''}
          {growthStats.growthPercentage.toFixed(1)}%
        </Text>
        <Text fontSize="xs" color="gray">
          Average daily growth
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

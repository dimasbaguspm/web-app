import { Badge } from '@dimasbaguspm/versaur';

interface ComparisonBadgeProps {
  percentageChange: number;
  isIncrease: boolean;
  showSign?: boolean;
}

export const ComparisonBadge = ({ percentageChange, showSign = true }: ComparisonBadgeProps) => {
  const isPositive = percentageChange >= 0;

  return (
    <Badge color={isPositive ? 'secondary' : 'primary'} shape="rounded">
      {showSign && (isPositive ? '+' : '')}
      {percentageChange.toFixed(1)}%
    </Badge>
  );
};

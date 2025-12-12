import { formatPrice } from '@dimasbaguspm/utils/price';
import { Button, Heading, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';

interface ThisMonthSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  onViewMore?: () => void;
}

export const ThisMonthSummaryCards = ({ totalIncome, totalExpense, onViewMore }: ThisMonthSummaryCardsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} color="ghost">
          This Month Summary
        </Heading>
        <Button variant="ghost" size="sm" onClick={onViewMore}>
          More <Icon as={ArrowRightIcon} color="inherit" size="sm" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-soft flex items-center justify-center">
              <Icon as={ArrowUpIcon} color="secondary" />
            </div>
            <div className="flex-1">
              <Text as="p" fontSize="xs" fontWeight="medium" color="gray" className="uppercase">
                Income
              </Text>
              <Text as="p" fontSize="xl" fontWeight="bold">
                {formatPrice(totalIncome)}
              </Text>
            </div>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <Icon as={ArrowDownIcon} color="primary" />
            </div>
            <div className="flex-1">
              <Text as="p" fontSize="xs" fontWeight="medium" color="gray" className="uppercase">
                Expenses
              </Text>
              <Text as="p" fontSize="xl" fontWeight="bold">
                {formatPrice(totalExpense)}
              </Text>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
};

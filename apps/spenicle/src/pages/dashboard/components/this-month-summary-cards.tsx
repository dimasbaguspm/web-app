import { formatPrice } from '@dimasbaguspm/utils/price';
import { Button, Icon, Tile } from '@dimasbaguspm/versaur';
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
        <h2 className="text-lg font-bold text-foreground">This Month Summary</h2>
        <Button variant="ghost" size="sm" onClick={onViewMore}>
          More <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-success-soft flex items-center justify-center">
              <Icon as={ArrowUpIcon} color="success" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground-light uppercase tracking-wide">Income</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(totalIncome)}</p>
            </div>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-danger-soft flex items-center justify-center">
              <Icon as={ArrowDownIcon} color="danger" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground-light uppercase tracking-wide">Expenses</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(totalExpense)}</p>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
};

import { formatPrice } from '@dimasbaguspm/utils/price';
import { ButtonMenuIcon, Heading, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowUpIcon, EllipsisVerticalIcon } from 'lucide-react';

interface ThisMonthSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  onViewSummaryClick: () => void;
  onViewTransactionsClick: () => void;
}

export const ThisMonthSummaryCards = ({
  totalIncome,
  totalExpense,
  onViewSummaryClick,
  onViewTransactionsClick,
}: ThisMonthSummaryCardsProps) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center gap-3 mb-4">
        <Heading level={3} color="ghost">
          This Month Summary
        </Heading>
        <ButtonMenuIcon as={EllipsisVerticalIcon} variant="outline" aria-label="Actions" placement="bottom-right">
          <ButtonMenuIcon.Item onClick={onViewSummaryClick}>View Summary</ButtonMenuIcon.Item>
          <ButtonMenuIcon.Item onClick={onViewTransactionsClick}>View Transactions</ButtonMenuIcon.Item>
        </ButtonMenuIcon>
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

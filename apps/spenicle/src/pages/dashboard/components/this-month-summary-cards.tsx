import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Button, ButtonGroup, ButtonMenuIcon, Heading, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { ArrowDownIcon, ArrowUpIcon, ChartColumnIcon, EllipsisVerticalIcon, ListCollapseIcon } from 'lucide-react';

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
  const { isMobile } = useWindowResize();
  return (
    <div>
      <div className="flex flex-row justify-between items-center gap-3 mb-4">
        <Heading as="h5" color="ghost">
          This Month At Glance
        </Heading>
        {isMobile ? (
          <ButtonMenuIcon as={EllipsisVerticalIcon} variant="outline" aria-label="Actions" placement="bottom-right">
            <ButtonMenuIcon.Item onClick={onViewSummaryClick}>
              <Icon as={ChartColumnIcon} color="inherit" size="sm" />
              Summary
            </ButtonMenuIcon.Item>
            <ButtonMenuIcon.Item onClick={onViewTransactionsClick}>
              <Icon as={ListCollapseIcon} color="inherit" size="sm" />
              Transactions
            </ButtonMenuIcon.Item>
          </ButtonMenuIcon>
        ) : (
          <ButtonGroup>
            <Button variant="outline" onClick={onViewSummaryClick}>
              <Icon as={ChartColumnIcon} color="inherit" size="sm" />
              Summary
            </Button>
            <Button variant="outline" onClick={onViewTransactionsClick}>
              <Icon as={ListCollapseIcon} color="inherit" size="sm" />
              Transactions
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-soft flex items-center justify-center">
              <Icon as={ArrowUpIcon} color="secondary" />
            </div>
            <div className="flex flex-col">
              <Text as="small" fontWeight="medium" color="gray" transform="uppercase">
                Income
              </Text>
              <Heading as="h4" color="neutral">
                {formatPrice(totalIncome)}
              </Heading>
            </div>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <Icon as={ArrowDownIcon} color="primary" />
            </div>
            <div className="flex flex-col">
              <Text as="small" fontWeight="medium" color="gray" transform="uppercase">
                Expenses
              </Text>
              <Heading as="h4" color="neutral">
                {formatPrice(totalExpense)}
              </Heading>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
};

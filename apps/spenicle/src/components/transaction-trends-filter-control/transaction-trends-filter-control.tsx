import { ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';

import { useTransactionTrendsFilter } from '../../hooks/use-transaction-trends-filter';

interface TransactionTrendsFiltersControlProps {
  config: ReturnType<typeof useTransactionTrendsFilter>;
}

export const TransactionTrendsFiltersControl = ({ config }: TransactionTrendsFiltersControlProps) => {
  const { filters, appliedFilters } = config;

  const handleOnMetricFilterClick = (name: 'net' | 'income' | 'expense') => {
    filters.replaceSingle('metric', name);
  };

  const hasMetricFilter = !!appliedFilters.metric;

  return (
    <ButtonGroup hasMargin>
      <ButtonMenu
        variant="outline"
        size="md"
        label={
          <>
            <Icon as={ChevronDownIcon} color="inherit" size="sm" />
            {hasMetricFilter ? startCase(appliedFilters.metric) : 'Metric'}
          </>
        }
      >
        <ButtonMenu.Item
          onClick={() => handleOnMetricFilterClick('expense')}
          active={appliedFilters.metric === 'expense'}
        >
          Expense
        </ButtonMenu.Item>
        <ButtonMenu.Item
          onClick={() => handleOnMetricFilterClick('income')}
          active={appliedFilters.metric === 'income'}
        >
          Income
        </ButtonMenu.Item>
        <ButtonMenu.Item onClick={() => handleOnMetricFilterClick('net')} active={appliedFilters.metric === 'net'}>
          Net
        </ButtonMenu.Item>
      </ButtonMenu>
    </ButtonGroup>
  );
};

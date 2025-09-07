import { ButtonGroup, ButtonIcon, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { startCase } from 'lodash';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';

import { useTransactionFilter } from '../../hooks/use-transaction-filter';

interface TransactionFiltersControlProps {
  config: ReturnType<typeof useTransactionFilter>;
  handleOnFilterClick?: () => void;
}

export const TransactionFiltersControl = ({ config, handleOnFilterClick }: TransactionFiltersControlProps) => {
  const { filters } = config;

  const handleOnTypeFilterClick = (name: string) => {
    const currentTypes = filters.getAll('type');
    if (currentTypes.includes(name)) {
      filters.removeSingle('type', name);
    } else {
      filters.replaceSingle('type', name);
    }
  };

  const hasTypeFilter = !!filters.getAll('type')?.length;

  return (
    <ButtonGroup>
      <ButtonMenu
        variant="outline"
        size="md"
        label={
          <>
            <Icon as={ChevronDownIcon} color="inherit" size="sm" />
            {hasTypeFilter ? startCase(filters.getSingle('type') || '') : 'Type'}
          </>
        }
      >
        <ButtonMenu.Item
          onClick={() => handleOnTypeFilterClick('expense')}
          active={filters.getAll('type')?.includes('expense')}
        >
          Expense
        </ButtonMenu.Item>
        <ButtonMenu.Item
          onClick={() => handleOnTypeFilterClick('income')}
          active={filters.getAll('type')?.includes('income')}
        >
          Income
        </ButtonMenu.Item>
        <ButtonMenu.Item
          onClick={() => handleOnTypeFilterClick('transfer')}
          active={filters.getAll('type')?.includes('transfer')}
        >
          Transfer
        </ButtonMenu.Item>
      </ButtonMenu>

      <ButtonIcon as={FilterIcon} variant="outline" size="md" onClick={handleOnFilterClick} aria-label="Open Filters" />
    </ButtonGroup>
  );
};

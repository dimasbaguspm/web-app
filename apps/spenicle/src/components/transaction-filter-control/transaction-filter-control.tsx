import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonIcon, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import { useRef } from 'react';

import { useTransactionFilter } from '../../hooks/use-transaction-filter';

interface TransactionFiltersControlProps {
  config: ReturnType<typeof useTransactionFilter>;
  handleOnFilterClick?: () => void;
  hideTypeFilter?: boolean;
  hideDateRangeFilter?: boolean;
  hideOtherFilters?: boolean;
}

export const TransactionFiltersControl = ({
  config,
  hideTypeFilter,
  hideDateRangeFilter,
  hideOtherFilters,
  handleOnFilterClick,
}: TransactionFiltersControlProps) => {
  const { filters, appliedFilters } = config;

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleOnTypeFilterClick = (name: string) => {
    const currentTypes = filters.getAll('type');
    if (currentTypes.includes(name)) {
      filters.removeSingle('type', name);
    } else {
      filters.replaceSingle('type', name);
    }
  };

  const hasTypeFilter = !!filters.getAll('type')?.length;

  const handleOnDateClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref?.current) return;

    if (typeof ref.current?.showPicker === 'function') {
      ref.current.showPicker();
    } else {
      ref.current.focus();
    }
  };

  return (
    <ButtonGroup>
      <If condition={!hideTypeFilter}>
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
      </If>

      <If condition={!hideDateRangeFilter}>
        <Button variant="outline" onClick={() => handleOnDateClick(startDateRef)} className="relative">
          <Icon as={ChevronDownIcon} color="inherit" size="sm" />
          {appliedFilters.startDate ? formatDate(appliedFilters.startDate, DateFormat.COMPACT_DATE) : 'Start'}
          <input
            type="date"
            tabIndex={-1}
            max={appliedFilters.endDate || undefined}
            onChange={(e) => {
              if (e.target.value === '') {
                filters.removeSingle('startDate');
              } else {
                filters.replaceSingle('startDate', e.target.value);
              }
            }}
            className="sr-only absolute -bottom-2.5 right-50 translate-x-1/2"
            ref={startDateRef}
          />
        </Button>
        <Button variant="outline" onClick={() => handleOnDateClick(endDateRef)} className="relative">
          <Icon as={ChevronDownIcon} color="inherit" size="sm" />
          {appliedFilters.endDate ? formatDate(appliedFilters.endDate, DateFormat.COMPACT_DATE) : 'End'}
          <input
            type="date"
            tabIndex={-1}
            min={appliedFilters.startDate || undefined}
            max={formatDate(dayjs().startOf('day'), DateFormat.ISO_DATE)}
            onChange={(e) => {
              if (e.target.value === '') {
                filters.removeSingle('endDate');
              } else {
                filters.replaceSingle('endDate', e.target.value);
              }
            }}
            className="sr-only absolute -bottom-2.5 right-50 translate-x-1/2"
            ref={endDateRef}
          />
        </Button>
      </If>

      <If condition={!hideOtherFilters}>
        <ButtonIcon
          as={FilterIcon}
          variant="outline"
          size="md"
          onClick={handleOnFilterClick}
          aria-label="Open Filters"
        />
      </If>
    </ButtonGroup>
  );
};

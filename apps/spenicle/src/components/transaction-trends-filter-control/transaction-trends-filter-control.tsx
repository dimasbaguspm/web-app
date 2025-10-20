import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { useRef } from 'react';

import { useTransactionTrendsFilter } from '../../hooks/use-transaction-trends-filter';

interface TransactionTrendsFiltersControlProps {
  config: ReturnType<typeof useTransactionTrendsFilter>;
  hideDateRangeFilter?: boolean;
  hideFrequencyFilter?: boolean;
}

export const TransactionTrendsFiltersControl = ({
  config,
  hideDateRangeFilter,
  hideFrequencyFilter,
}: TransactionTrendsFiltersControlProps) => {
  const { filters, appliedFilters } = config;

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleOnMetricFilterClick = (name: 'net' | 'income' | 'expense') => {
    filters.replaceSingle('metric', name);
  };

  const hasMetricFilter = !!appliedFilters.metric;

  const handleOnDateClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref?.current) return;

    if (typeof ref.current?.showPicker === 'function') {
      ref.current.showPicker();
    } else {
      ref.current.focus();
    }
  };

  return (
    <ButtonGroup hasMargin overlay>
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
      <If condition={!hideDateRangeFilter}>
        <Button variant="outline" onClick={() => handleOnDateClick(startDateRef)} className="relative flex-shrink-0">
          <Icon as={ChevronDownIcon} color="inherit" size="sm" />
          {appliedFilters.startDate
            ? 'Start ' + formatDate(appliedFilters.startDate, DateFormat.DAY_MONTH_YEAR)
            : 'Start'}
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
        <Button variant="outline" onClick={() => handleOnDateClick(endDateRef)} className="relative flex-shrink-0">
          <Icon as={ChevronDownIcon} color="inherit" size="sm" />
          {appliedFilters.endDate ? 'End ' + formatDate(appliedFilters.endDate, DateFormat.DAY_MONTH_YEAR) : 'End'}
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
      <If condition={!hideFrequencyFilter}>
        <ButtonMenu
          variant="outline"
          size="md"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              {appliedFilters.frequency ? 'Freq. ' + startCase(appliedFilters.frequency) : 'Frequency'}
            </>
          }
        >
          <ButtonMenu.Item
            onClick={() => filters.replaceSingle('frequency', 'daily')}
            active={appliedFilters.frequency === 'daily'}
          >
            Daily
          </ButtonMenu.Item>
          <ButtonMenu.Item
            onClick={() => filters.replaceSingle('frequency', 'weekly')}
            active={appliedFilters.frequency === 'weekly'}
          >
            Weekly
          </ButtonMenu.Item>
          <ButtonMenu.Item
            onClick={() => filters.replaceSingle('frequency', 'monthly')}
            active={appliedFilters.frequency === 'monthly'}
          >
            Monthly
          </ButtonMenu.Item>
        </ButtonMenu>
      </If>
    </ButtonGroup>
  );
};

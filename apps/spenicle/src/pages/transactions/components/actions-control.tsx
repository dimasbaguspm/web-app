import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, FilterChip, FilterChipGroup, Icon } from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarCogIcon } from 'lucide-react';
import { ChangeEvent, FC, useRef } from 'react';

import { TransactionFiltersControl } from '../../../components/transaction-filter-control';
import { useTransactionFilter } from '../../../hooks/use-transaction-filter';

interface ActionsControlProps {
  date: Dayjs;
  onFilterClick: () => void;
  onDateChange: (date: Dayjs) => void;
}

export const ActionsControl: FC<ActionsControlProps> = ({ date, onFilterClick, onDateChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const config = useTransactionFilter();

  const handleOnCalendarClick = () => {
    if (!inputRef.current) return;

    if ('showPicker' in inputRef.current) {
      inputRef.current?.showPicker();
    } else {
      // @ts-expect-error as a fallback
      inputRef.current?.focus();
    }
  };

  const handleOnDateChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    if (value) {
      onDateChange(dayjs(value));
    } else {
      onDateChange(dayjs());
    }
  };

  return (
    <>
      <ButtonGroup alignment="between" className="mb-4">
        <TransactionFiltersControl handleOnFilterClick={onFilterClick} config={config} hideDateRangeFilter />
        <Button variant="outline" onClick={handleOnCalendarClick} className="relative">
          <Icon as={CalendarCogIcon} size="sm" color="gray" />
          Calendar
          <input
            type="date"
            tabIndex={-1}
            className="sr-only absolute -bottom-2.5 right-50 translate-x-1/2"
            ref={inputRef}
            value={formatDate(date, DateFormat.ISO_DATE)}
            onChange={handleOnDateChange}
          />
        </Button>
      </ButtonGroup>

      <If condition={config.humanizedFilters.length > 0}>
        <FilterChipGroup overlay hasMargin>
          {config.humanizedFilters.map(([key, label]) => (
            <FilterChip key={key} onClick={() => config.removeFilter(key)}>
              {label}
            </FilterChip>
          ))}
        </FilterChipGroup>
      </If>
    </>
  );
};

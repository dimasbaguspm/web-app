import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Button, ButtonGroup, Icon } from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarCogIcon, FilterIcon } from 'lucide-react';
import { FC, useRef } from 'react';

interface ActionsControlProps {
  date: Dayjs;
  onFilterClick: () => void;
  onDateChange: (date: Dayjs) => void;
}

export const ActionsControl: FC<ActionsControlProps> = ({
  date,
  onFilterClick,
  onDateChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnCalendarClick = () => {
    if (!inputRef.current) return;

    if ('showPicker' in inputRef.current) {
      inputRef.current?.showPicker();
    } else {
      // @ts-expect-error as a fallback
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <ButtonGroup alignment="between" className="mb-4">
        <Button variant="outline" onClick={onFilterClick}>
          <Icon as={FilterIcon} size="sm" color="gray" />
          Filter
        </Button>
        <Button
          variant="outline"
          onClick={handleOnCalendarClick}
          className="relative"
        >
          <Icon as={CalendarCogIcon} size="sm" color="gray" />
          Calendar
          <input
            type="date"
            className="sr-only absolute -bottom-2.5 right-50 translate-x-1/2"
            ref={inputRef}
            value={formatDate(date, DateFormat.ISO_DATE)}
            onChange={(e) => onDateChange(dayjs(e.target.value))}
          />
        </Button>
      </ButtonGroup>
    </>
  );
};

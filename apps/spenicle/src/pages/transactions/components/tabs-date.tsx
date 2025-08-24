import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Tabs, Text } from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useMemo } from 'react';

import { getDateRange } from '../helpers';

interface TabsDateProps {
  activeDate: Dayjs;
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

export const TabsDate: FC<TabsDateProps> = ({
  activeDate,
  selectedDate,
  onDateChange,
}) => {
  const { isDesktop } = useWindowResize();

  const dates = useMemo(
    () => getDateRange(selectedDate, isDesktop ? 'twoWeeks' : 'week'),
    [activeDate, isDesktop],
  );

  return (
    <Tabs
      value={formatDate(selectedDate.toDate(), DateFormat.ISO_DATE)}
      onValueChange={(date) => onDateChange(dayjs(date))}
      className="justify-between"
    >
      {dates.map((date) => {
        const isActive = date.isSame(selectedDate, 'day');

        return (
          <Tabs.Trigger
            key={date.toString()}
            value={formatDate(date.toISOString(), DateFormat.ISO_DATE)}
            className="flex flex-col"
          >
            <Text fontSize="xs" color={isActive ? 'primary' : 'gray'}>
              {formatDate(date.toISOString(), DateFormat.SHORT_DAY)}
            </Text>
            <br />
            {formatDate(date.toISOString(), DateFormat.NUMERIC_DAY)}
          </Tabs.Trigger>
        );
      })}
    </Tabs>
  );
};

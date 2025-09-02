import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { Tabs, Text } from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useMemo } from 'react';

import { getDateRange } from '../helpers';

interface TabsDateProps {
  date: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

export const TabsDate: FC<TabsDateProps> = ({ date, onDateChange }) => {
  const { isDesktop } = useWindowResize();

  const dates = useMemo(() => getDateRange(date, isDesktop ? 'twoWeeks' : 'week'), [date, isDesktop]);

  const handleTabChange = (date: string) => {
    onDateChange(dayjs(date));
  };

  return (
    <Tabs
      value={formatDate(date.toDate(), DateFormat.ISO_DATE)}
      onValueChange={handleTabChange}
      className="justify-between overflow-x-hidden"
    >
      {dates.map((mappedDate) => {
        const isActive = date.isSame(mappedDate, 'day');

        return (
          <Tabs.Trigger
            key={mappedDate.toString()}
            value={formatDate(mappedDate.toISOString(), DateFormat.ISO_DATE)}
            className="flex flex-col hover:text-primary"
          >
            <Text fontSize="xs" align="center" color={isActive ? 'primary' : 'inherit'}>
              {formatDate(mappedDate.toISOString(), DateFormat.SHORT_DAY)}
            </Text>
            {formatDate(mappedDate.toISOString(), DateFormat.NUMERIC_DAY)}
          </Tabs.Trigger>
        );
      })}
    </Tabs>
  );
};

import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import {
  Button,
  ButtonGroup,
  Icon,
  PageContent,
  PageHeader,
  Tabs,
  Text,
} from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { Calendar1Icon, FilterIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { getDateRange } from './helpers';

const TransactionsPage = () => {
  const [activeDate] = useState<Dayjs>(dayjs().startOf('day'));
  const [selectedDate, setSelectedDate] = useState<Dayjs>(activeDate);

  const { openDrawer } = useDrawerRoute();

  const { isDesktop } = useWindowResize();

  const dates = useMemo(
    () => getDateRange(selectedDate, isDesktop ? 'twoWeeks' : 'week'),
    [activeDate, isDesktop],
  );

  const handleOnDateChange = (date: string) => {
    setSelectedDate(dayjs(date));
  };

  const handleOnNewTransactionClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_TRANSACTION);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        actions={
          <ButtonGroup>
            <Button onClick={handleOnNewTransactionClick}>
              <Icon as={PlusIcon} color="inherit" />
              New Transaction
            </Button>
          </ButtonGroup>
        }
        tabs={
          <Tabs
            value={formatDate(selectedDate.toDate(), DateFormat.ISO_DATE)}
            onValueChange={handleOnDateChange}
            className="overflow-auto justify-between"
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
        }
      />
      <PageContent>
        <ButtonGroup alignment="start">
          <Button variant="outline">
            <Icon as={FilterIcon} size="sm" color="gray" />
            Filter
          </Button>
          <Button variant="outline">
            <Icon as={Calendar1Icon} size="sm" color="gray" />
            Calendar
          </Button>
        </ButtonGroup>

        <p>Cards</p>
      </PageContent>
    </>
  );
};

export default TransactionsPage;

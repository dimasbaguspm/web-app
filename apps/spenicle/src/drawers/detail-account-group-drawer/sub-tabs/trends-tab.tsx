import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountGroupModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { ButtonGroup, ButtonMenu, Icon, PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { TrendsChart } from '../components/trends-chart';
import { TrendsStats } from '../components/trends-stats';

interface TrendsTabProps {
  accountGroup: AccountGroupModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ accountGroup }) => {
  const [selected, setSelected] = useState<'net' | 'income' | 'expense'>('net');
  const [transactions, , { isLoading }] = useApiSpenicleSummaryTransactionsQuery({
    from: dayjs().startOf('year').add(1, 'day').toISOString(),
    to: dayjs().endOf('month').toISOString(),
    accountId: accountGroup.memberIds,
    sortBy: 'date',
    frequency: 'monthly',
  });

  const handleOnSelect = (value: 'net' | 'income' | 'expense') => {
    setSelected(value);
  };

  return (
    <>
      <If condition={[isLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, !!transactions]}>
        <ButtonGroup hasMargin>
          <ButtonMenu
            variant="outline"
            label={
              <>
                <Icon as={ChevronDownIcon} size="sm" color="inherit" />
                {startCase(selected)}
              </>
            }
          >
            <ButtonMenu.Item onClick={() => handleOnSelect('net')} active={selected === 'net'}>
              Net
            </ButtonMenu.Item>
            <ButtonMenu.Item onClick={() => handleOnSelect('income')} active={selected === 'income'}>
              Income
            </ButtonMenu.Item>
            <ButtonMenu.Item onClick={() => handleOnSelect('expense')} active={selected === 'expense'}>
              Expense
            </ButtonMenu.Item>
          </ButtonMenu>
        </ButtonGroup>

        <TrendsChart transactions={transactions!} metric={selected} />
        <TrendsStats transactions={transactions!} metric={selected} />
      </If>
    </>
  );
};

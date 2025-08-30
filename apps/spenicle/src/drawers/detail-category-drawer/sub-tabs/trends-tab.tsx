import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Icon,
  LoadingIndicator,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FilterIcon } from 'lucide-react';
import { FC } from 'react';

import { TrendsChart } from '../components/trends-chart';
import { TrendsStats } from '../components/trends-stats';

interface TrendsTabProps {
  data: CategoryModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ data }) => {
  const [transactions, , { isFetching }] =
    useApiSpenicleSummaryTransactionsQuery({
      from: dayjs().startOf('year').add(1, 'day').toISOString(),
      to: dayjs().endOf('month').toISOString(),
      categoryId: [data.id],
      sortBy: 'date',
      frequency: 'monthly',
    });

  return (
    <>
      <ButtonGroup className="mb-4">
        <Button variant="outline">
          <Icon as={FilterIcon} color="inherit" size="sm" />
          Filter
        </Button>
      </ButtonGroup>

      <If condition={[isFetching]}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isFetching, !!transactions]}>
        <TrendsChart data={data} transactions={transactions!} />
        <TrendsStats data={data} transactions={transactions!} />
      </If>
    </>
  );
};

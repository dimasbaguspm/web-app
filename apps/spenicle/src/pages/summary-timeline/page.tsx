import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import dayjs from 'dayjs';

const SummaryTimeline = () => {
  const [transactions] = useApiSpenicleTransactionsInfiniteQuery({
    dateFrom: dayjs().startOf('month').toISOString(),
    dateTo: dayjs().endOf('month').toISOString(),
    pageSize: 10,
  });

  return <pre>{JSON.stringify(transactions, null, 2)}</pre>;
};

export default SummaryTimeline;

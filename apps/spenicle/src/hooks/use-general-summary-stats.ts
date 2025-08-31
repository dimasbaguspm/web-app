import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import dayjs from 'dayjs';

export interface GeneralSummaryStatsModel {
  // metric-specific aggregates (based on `metric` option)
  metricTotal: number;
  metricAveragePerPeriod: number;
  metricMax: number;
  metricMin: number;

  // transactions and frequency
  transactionCount: number;
  avgTransactionValue: number;
  avgTransactionsPerDay: number;
  avgTransactionsPerUnit: number; // per periodGranularity

  // peaks and extremes
  maxExpenseInPeriod: number;
  maxNetInPeriod: number;
  maxIncomeInPeriod: number;
  peakPeriodByTransactionCount: string;
  peakPeriodByHighestNet: string;

  // formatted peak period for the selected metric
  peakPeriodFormatted: string;
  // dates for maximums (formatted)
  maxExpenseDateInPeriod: string;
  maxNetDateInPeriod: string;
  maxIncomeDateInPeriod: string;
}

export interface GeneralSummaryStatsOptions {
  metric?: 'net' | 'expense' | 'income' | 'transfer';
  periodGranularity?: 'day' | 'week' | 'month' | 'year' | 'hour';
}
export const useGeneralSummaryStats = (
  data: SummaryTransactionsModel,
  options?: GeneralSummaryStatsOptions,
): GeneralSummaryStatsModel => {
  const { metric = 'net' } = options || {};

  const summaryStats: GeneralSummaryStatsModel = {
    metricTotal: 0,
    metricAveragePerPeriod: 0,
    metricMax: 0,
    metricMin: 0,

    transactionCount: 0,
    avgTransactionValue: 0,
    avgTransactionsPerDay: 0,
    avgTransactionsPerUnit: 0,

    maxExpenseInPeriod: 0,
    maxNetInPeriod: 0,
    maxIncomeInPeriod: 0,
    peakPeriodByTransactionCount: '',
    peakPeriodByHighestNet: '',

    peakPeriodFormatted: '',
    maxExpenseDateInPeriod: '',
    maxNetDateInPeriod: '',
    maxIncomeDateInPeriod: '',
  };

  if (data && data.length > 0) {
    // consider only periods that have transactions
    const active = data.filter((d) => (d.totalTransactions ?? 0) > 0);

    if (active.length === 0) return summaryStats;

    const getValue = (tx: (typeof active)[number]) => {
      switch (metric) {
        case 'income':
          return tx.income ?? 0;
        case 'expense':
          return tx.expense ?? 0;
        case 'transfer':
          return tx.transfer ?? 0;
        default:
          return tx.net ?? 0;
      }
    };

    const values = active.map(getValue);

    summaryStats.metricTotal = values.reduce((sum, val) => sum + val, 0);
    summaryStats.metricAveragePerPeriod = summaryStats.metricTotal / active.length;
    summaryStats.metricMax = Math.max(...values);
    summaryStats.metricMin = Math.min(...values);
    summaryStats.transactionCount = active.reduce((sum, tx) => sum + (tx.totalTransactions ?? 0), 0);

    // additional metrics
    summaryStats.avgTransactionValue =
      summaryStats.transactionCount > 0 ? summaryStats.metricTotal / summaryStats.transactionCount : 0;

    // days span (if single period use days in that month)
    const firstDate = dayjs(active[0].date);
    const lastDate = dayjs(active[active.length - 1].date);

    // compute days span
    const daysSpan = active.length === 1 ? firstDate.endOf('month').date() : lastDate.diff(firstDate, 'day') + 1;

    summaryStats.avgTransactionsPerDay = daysSpan > 0 ? summaryStats.transactionCount / daysSpan : 0;

    // compute average transactions per requested granularity if provided
    const { periodGranularity = 'day' } = options || {};
    let unitsSpan = 0;
    switch (periodGranularity) {
      case 'hour':
        unitsSpan = lastDate.diff(firstDate, 'hour') + 1;
        break;
      case 'week':
        unitsSpan = lastDate.diff(firstDate, 'week') + 1;
        break;
      case 'month':
        unitsSpan = lastDate.diff(firstDate, 'month') + 1;
        break;
      case 'year':
        unitsSpan = lastDate.diff(firstDate, 'year') + 1;
        break;
      default:
        unitsSpan = daysSpan;
    }

    // attach averageTransactionsPerUnit for reporting
    summaryStats.avgTransactionsPerUnit = unitsSpan > 0 ? summaryStats.transactionCount / unitsSpan : 0;

    summaryStats.maxExpenseInPeriod = Math.max(...active.map((t) => t.expense ?? 0));
    summaryStats.maxNetInPeriod = Math.max(...active.map((t) => t.net ?? 0));
    summaryStats.maxIncomeInPeriod = Math.max(...active.map((t) => t.income ?? 0));

    // find dates for maxima and format them
    const maxExpenseTx = active.find((t) => (t.expense ?? 0) === summaryStats.maxExpenseInPeriod);
    const maxNetTx = active.find((t) => (t.net ?? 0) === summaryStats.maxNetInPeriod);
    const maxIncomeTx = active.find((t) => (t.income ?? 0) === summaryStats.maxIncomeInPeriod);

    const dateFormat = (() => {
      switch (periodGranularity) {
        case 'week':
        case 'day':
        case 'hour':
          return DateFormat.WEEKDAY_DATE;
        case 'month':
          return DateFormat.MONTH_YEAR;
        case 'year':
          return DateFormat.YEAR;
      }
    })();

    summaryStats.maxExpenseDateInPeriod = formatDate(maxExpenseTx?.date || '', dateFormat);
    summaryStats.maxNetDateInPeriod = formatDate(maxNetTx?.date || '', dateFormat);
    summaryStats.maxIncomeDateInPeriod = formatDate(maxIncomeTx?.date || '', dateFormat);

    const peakByTx = active.reduce(
      (best, t) => ((t.totalTransactions ?? 0) > (best.totalTransactions ?? 0) ? t : best),
      active[0],
    );
    summaryStats.peakPeriodByTransactionCount = formatDate(peakByTx?.date || '', dateFormat);

    const peakByNet = active.find((t) => (t.net ?? 0) === summaryStats.maxNetInPeriod) || active[0];
    summaryStats.peakPeriodByHighestNet = formatDate(peakByNet?.date || '', dateFormat);

    // peak month by highest selected value
    const peak = active.find((tx) => getValue(tx) === summaryStats.metricMax);
    summaryStats.peakPeriodFormatted = formatDate(peak?.date || '', dateFormat);
  }

  return summaryStats;
};

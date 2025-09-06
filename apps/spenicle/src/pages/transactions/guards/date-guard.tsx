import dayjs, { Dayjs } from 'dayjs';
import { FC, ReactNode } from 'react';
import { Navigate, useParams } from 'react-router';

import { DEEP_LINKS } from '../../../constants/page-routes';

const maxValidDateRange = dayjs().add(5, 'year');

interface DateGuardProps {
  children: (startDate: Dayjs) => ReactNode;
}

export const DateGuard: FC<DateGuardProps> = ({ children }) => {
  const { year, month, day } = useParams<{
    year: string;
    month: string;
    day: string;
  }>();

  const hasParams = year && month && day;

  const initialDate = hasParams
    ? dayjs().set('y', parseInt(year)).set('M', parseInt(month)).set('D', parseInt(day))
    : dayjs();

  if (!initialDate.isValid() || initialDate.isAfter(maxValidDateRange) || !hasParams) {
    const today = dayjs();

    return <Navigate to={DEEP_LINKS.TRANSACTIONS_DATE.path(today.year(), today.month(), today.date())} replace />;
  }

  return children(initialDate);
};

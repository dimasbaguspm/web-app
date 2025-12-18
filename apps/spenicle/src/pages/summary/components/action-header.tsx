import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { ChipSingleInput, Icon } from '@dimasbaguspm/versaur';
import { SquareChartGanttIcon, TargetIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/page-routes';

import { FiltersControl } from './filters-control';

export const ActionHeader: FC = () => {
  const { isDesktop } = useWindowResize();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnNavigate = (value: 'overview' | 'breakdown') => {
    navigate({
      pathname: value === 'breakdown' ? DEEP_LINKS.SUMMARY_BREAKDOWN.path : DEEP_LINKS.SUMMARY.path,
      search: location.search,
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between w-full mb-4">
        <FiltersControl />
        <ChipSingleInput
          value={location.pathname === DEEP_LINKS.SUMMARY_BREAKDOWN.path ? 'breakdown' : 'overview'}
          label=""
          size="md"
          name="1"
          className="w-auto"
          onChange={(data) => handleOnNavigate(data as 'overview' | 'breakdown')}
        >
          <ChipSingleInput.Option value="overview">
            <Icon as={TargetIcon} color="inherit" size="sm" />
            {isDesktop && 'Overview'}
          </ChipSingleInput.Option>
          <ChipSingleInput.Option value="breakdown">
            <Icon as={SquareChartGanttIcon} color="inherit" size="sm" />
            {isDesktop && 'Breakdown'}
          </ChipSingleInput.Option>
        </ChipSingleInput>
      </div>
    </>
  );
};

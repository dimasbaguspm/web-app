import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { ChipSingleInput, Icon } from '@dimasbaguspm/versaur';
import { CalendarCheck2Icon, TargetIcon } from 'lucide-react';
import { FC } from 'react';

export const ActionHeader: FC = () => {
  const { isDesktop } = useWindowResize();

  return (
    <ChipSingleInput value="summary" label="" size="md" name="1">
      <ChipSingleInput.Option value="summary">
        <Icon as={TargetIcon} color="inherit" size="sm" />
        {isDesktop && 'Overview'}
      </ChipSingleInput.Option>
      <ChipSingleInput.Option value="calendar">
        <Icon as={CalendarCheck2Icon} color="inherit" size="sm" />
        {isDesktop && 'Calendar'}
      </ChipSingleInput.Option>
    </ChipSingleInput>
  );
};

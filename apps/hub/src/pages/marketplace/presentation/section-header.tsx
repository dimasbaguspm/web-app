import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import type { SectionHeaderProps } from '../types';

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightContent,
}) => {
  const { isMobile } = useWindowResize();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Text as="h1" fontSize="3xl" fontWeight="bold" color="black">
          {title}
        </Text>
        {!isMobile && subtitle && (
          <Text as="p" color="gray">
            {subtitle}
          </Text>
        )}
      </div>
      {rightContent && rightContent}
    </div>
  );
};

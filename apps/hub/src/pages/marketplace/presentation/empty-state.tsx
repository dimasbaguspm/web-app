import { Text } from '@dimasbaguspm/versaur';
import { AppWindowIcon } from 'lucide-react';
import { FC } from 'react';

import type { EmptyStateProps } from '../types';

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = AppWindowIcon,
}) => {
  return (
    <div className="py-12 px-4 border-2 border-dashed border-border rounded-lg">
      <Icon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <Text
        as="h3"
        fontSize="lg"
        fontWeight="semibold"
        color="gray"
        align="center"
        className="mb-2"
      >
        {title}
      </Text>
      <Text as="p" color="gray" fontSize="sm" align="center">
        {description}
      </Text>
    </div>
  );
};

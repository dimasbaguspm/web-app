import { Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import type { GroupsQuickStatsProps } from '../types';

export const GroupsQuickStats: FC<GroupsQuickStatsProps> = ({
  groupsCount,
  totalMembers,
  availableApps,
}) => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
      <Text as="h3" fontSize="lg" fontWeight="medium" className="mb-4">
        Quick Overview
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-center">
          <Text as="p" fontSize="2xl" fontWeight="bold" color="black">
            {groupsCount}
          </Text>
          <Text as="p" fontSize="sm" color="gray">
            Groups
          </Text>
        </div>
        <div className="text-center">
          <Text as="p" fontSize="2xl" fontWeight="bold" color="black">
            {totalMembers}
          </Text>
          <Text as="p" fontSize="sm" color="gray">
            Total Members
          </Text>
        </div>
        <div className="text-center">
          <Text as="p" fontSize="2xl" fontWeight="bold" color="black">
            {availableApps}
          </Text>
          <Text as="p" fontSize="sm" color="gray">
            Available Apps
          </Text>
        </div>
      </div>
    </div>
  );
};

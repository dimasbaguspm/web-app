import { FC } from 'react';

import { useMarketplaceContext } from '../context/context';

import { AppCard } from './app-card';

export const AppsGrid: FC = () => {
  const { data } = useMarketplaceContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.availableApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
};

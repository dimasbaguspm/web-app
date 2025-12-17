import { FC } from 'react';

import { FiltersControl } from './filters-control';

export const ActionHeader: FC = () => {
  return (
    <>
      <div className="flex flex-row justify-between w-full mb-4">
        <FiltersControl />
      </div>
    </>
  );
};

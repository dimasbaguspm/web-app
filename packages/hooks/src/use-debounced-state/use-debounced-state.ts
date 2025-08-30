import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export interface UseDebouncedStateOptions {
  debounceTime?: number;
  defaultValue?: string;
}

export const useDebouncedState = (options: UseDebouncedStateOptions = {}) => {
  const { debounceTime = 1000, defaultValue = '' } = options;

  const [searchValue, setSearchValue] = useState<string>(defaultValue);

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), debounceTime),
    [debounceTime],
  );

  return [searchValue, debouncedSetSearch] as const;
};

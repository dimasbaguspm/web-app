import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export interface UseDebouncedStateOptions<T> {
  debounceTime?: number;
  defaultValue?: T;
}

export const useDebouncedState = <T>(options: UseDebouncedStateOptions<T> = {}) => {
  const { debounceTime = 1000, defaultValue = '' } = options;

  const [searchValue, setSearchValue] = useState<T>(defaultValue as T);

  const debouncedSetSearch = useMemo(() => debounce((value: T) => setSearchValue(value), debounceTime), [debounceTime]);

  return [searchValue, debouncedSetSearch] as const;
};

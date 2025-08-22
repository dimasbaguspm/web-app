import { createContext } from 'react';

import { ActiveAppProfileModel } from './types';

export const ActiveAppProfileContext =
  createContext<ActiveAppProfileModel | null>(null);

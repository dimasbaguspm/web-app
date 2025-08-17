import { createContext } from 'react';

import type { ProfilesContextValue } from '../types';

export const ProfilesContext = createContext<ProfilesContextValue | null>(null);

import { createContext } from 'react';

import { AuthProviderModel } from './types';

export const AuthContext = createContext<AuthProviderModel | null>(null);

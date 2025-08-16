import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, StrictMode } from 'react';

import { AuthProvider } from '../providers/auth-provider';

import { Router } from './routes';

const qc = new QueryClient();

export const App: FC = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
};

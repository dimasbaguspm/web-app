import { SnackbarsProvider } from '@dimasbaguspm/versaur';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, StrictMode } from 'react';

import { AuthProvider } from '../providers/auth-provider';

import { PageRouter } from './page-routes';

const qc = new QueryClient();

export const App: FC = () => {
  return (
    <StrictMode>
      <SnackbarsProvider>
        <QueryClientProvider client={qc}>
          <AuthProvider>
            <PageRouter />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SnackbarsProvider>
    </StrictMode>
  );
};

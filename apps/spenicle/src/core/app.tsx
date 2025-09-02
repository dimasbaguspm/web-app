import { AppId } from '@dimasbaguspm/constants';
import { ActiveAppProfileProvider } from '@dimasbaguspm/providers/active-app-profile-provider';
import { AuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { GlobalProvider } from '@dimasbaguspm/providers/global-provider';
import { SnackbarsProvider } from '@dimasbaguspm/versaur';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, StrictMode } from 'react';

import { PageRouter } from './page-routes';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
    },
    mutations: {
      networkMode: 'online',
    },
  },
});

export const App: FC = () => {
  return (
    <StrictMode>
      <GlobalProvider>
        <SnackbarsProvider>
          <QueryClientProvider client={qc}>
            <AuthProvider>
              <ActiveAppProfileProvider appId={AppId.Spenicle}>
                <PageRouter />
              </ActiveAppProfileProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen />
          </QueryClientProvider>
        </SnackbarsProvider>
      </GlobalProvider>
    </StrictMode>
  );
};

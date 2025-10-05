import { AppId } from '@dimasbaguspm/constants';
import { ActiveAppProfileProvider } from '@dimasbaguspm/providers/active-app-profile-provider';
import { AuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { GlobalProvider } from '@dimasbaguspm/providers/global-provider';
import { PortalProvider } from '@dimasbaguspm/providers/portal-provider';
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

interface AppProps {
  appId: AppId;
}

export const App: FC<AppProps> = ({ appId }) => {
  return (
    <StrictMode>
      <PortalProvider>
        <GlobalProvider appId={appId}>
          <SnackbarsProvider>
            <QueryClientProvider client={qc}>
              <AuthProvider>
                <ActiveAppProfileProvider>
                  <PageRouter />
                </ActiveAppProfileProvider>
              </AuthProvider>
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </QueryClientProvider>
          </SnackbarsProvider>
        </GlobalProvider>
      </PortalProvider>
    </StrictMode>
  );
};

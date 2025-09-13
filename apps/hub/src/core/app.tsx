import { AppId } from '@dimasbaguspm/constants';
import { AuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { GlobalProvider } from '@dimasbaguspm/providers/global-provider';
import { SnackbarsProvider } from '@dimasbaguspm/versaur';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, StrictMode } from 'react';

import { PageRouter } from './page-routes';

const qc = new QueryClient();

interface AppProps {
  appId: AppId;
}

export const App: FC<AppProps> = ({ appId }) => {
  return (
    <StrictMode>
      <GlobalProvider appId={appId}>
        <SnackbarsProvider>
          <QueryClientProvider client={qc}>
            <AuthProvider>
              <PageRouter />
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SnackbarsProvider>
      </GlobalProvider>
    </StrictMode>
  );
};

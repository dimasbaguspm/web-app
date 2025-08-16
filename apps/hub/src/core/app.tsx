import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, StrictMode } from 'react';

import { AuthProvider } from '../providers/auth-provider';

const qc = new QueryClient();

export const App: FC = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <h1>Welcome to the Hub</h1>
          <p>This is the main application component.</p>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
};

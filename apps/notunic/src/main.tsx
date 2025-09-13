import { AppId } from '@dimasbaguspm/constants';
import { createRoot } from 'react-dom/client';
import './main.css';

const bootstrap = async () => {
  const rootEl = document.getElementById('app');
  if (!rootEl) throw new Error('Root element not found');

  const { App } = await import('./core/app');

  const root = createRoot(rootEl);

  root.render(<App appId={AppId.Notunic} />);
};

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});

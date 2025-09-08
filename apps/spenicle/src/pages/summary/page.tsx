import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { snapdom } from '@zumer/snapdom';
import { PrinterIcon } from 'lucide-react';
import { useRef } from 'react';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const handleOnPrintClick = async () => {
    if (!ref.current) return;

    const result = await snapdom(ref.current);

    const img = await result.toPng();
    document.body.appendChild(img);

    await result.download({
      format: 'png',
      compress: false,
      filename: 'spenicle-exported-summary-' + new Date().toISOString(),
      backgroundColor: '#ffffff',
    });
  };

  return (
    <div ref={ref}>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={
          <ButtonGroup>
            <Button onClick={handleOnPrintClick}>
              <Icon as={PrinterIcon} color="inherit" size="sm" />
              Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon onClick={handleOnPrintClick} as={PrinterIcon} aria-label="Report" />
          </ButtonGroup>
        }
      />
      <PageContent>
        <ActionHeader />
        <Outlet />
      </PageContent>
    </div>
  );
};

export default SummaryLayout;

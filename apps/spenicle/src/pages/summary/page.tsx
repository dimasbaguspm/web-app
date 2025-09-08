import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { snapdom } from '@zumer/snapdom';
import { PrinterIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  const [isPrinting, setIsPrinting] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleOnPrintClick = async () => {
    try {
      setIsPrinting(true);
      if (!ref.current) return;

      const result = await snapdom(ref.current);

      await result.download({
        fast: false,
        format: 'png',
        compress: false,
        filename: 'spenicle-exported-summary-' + new Date().toISOString(),
        backgroundColor: '#ffffff',
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div ref={ref}>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={
          <ButtonGroup>
            <Button disabled={isPrinting} onClick={handleOnPrintClick}>
              <Icon as={PrinterIcon} color="inherit" size="sm" />
              Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon disabled={isPrinting} onClick={handleOnPrintClick} as={PrinterIcon} aria-label="Report" />
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

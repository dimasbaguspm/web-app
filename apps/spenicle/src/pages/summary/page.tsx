import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { snapdom } from '@zumer/snapdom';
import { ArrowBigDownDashIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  const location = useLocation();
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
        filename: 'spenicle-exported-summary-' + new Date().toISOString(),
        backgroundColor: '#ffffff',
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div ref={ref} key={location.pathname}>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        size="wide"
        actions={
          <ButtonGroup>
            <Button disabled={isPrinting} onClick={handleOnPrintClick}>
              <Icon as={ArrowBigDownDashIcon} color="inherit" size="sm" />
              Download Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon
              disabled={isPrinting}
              onClick={handleOnPrintClick}
              as={ArrowBigDownDashIcon}
              aria-label="Download Report"
            />
          </ButtonGroup>
        }
      />
      <PageContent size="wide">
        <ActionHeader />
        <Outlet />
      </PageContent>
    </div>
  );
};

export default SummaryLayout;

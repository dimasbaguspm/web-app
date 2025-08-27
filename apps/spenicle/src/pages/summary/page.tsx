import {
  ButtonIcon,
  PageContent,
  PageHeader,
  Text,
  Tile,
} from '@dimasbaguspm/versaur';
import { SortDescIcon } from 'lucide-react';

import { ActionControl } from './components/action-control';
import { ActionHeader } from './components/action-header';
import { FilterControl } from './components/filter-control';

const SummaryPage = () => {
  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={<ActionHeader />}
        mobileActions={<ActionHeader />}
      />
      <PageContent>
        <ActionControl />
        <FilterControl />

        <div className="grid grid-cols-1 gap-4">
          <Tile>
            <Text as="h4" fontWeight="medium">
              Overview
            </Text>
          </Tile>

          <div className="grid grid-cols-3 gap-4">
            <Tile>
              <div className="flex flex-row justify-between">
                <Text as="h5" fontWeight="medium">
                  Spending list
                </Text>
                <ButtonIcon
                  aria-label="Sort"
                  as={SortDescIcon}
                  variant="ghost"
                  size="sm"
                />
              </div>
            </Tile>
            <Tile>
              <div className="flex flex-row justify-between">
                <Text as="h5" fontWeight="medium">
                  Income list
                </Text>
                <ButtonIcon
                  aria-label="Sort"
                  as={SortDescIcon}
                  variant="ghost"
                  size="sm"
                />
              </div>
            </Tile>
            <Tile>
              <div className="flex flex-row justify-between">
                <Text as="h5" fontWeight="medium">
                  Date frequncy
                </Text>
                <ButtonIcon
                  aria-label="Sort"
                  as={SortDescIcon}
                  variant="ghost"
                  size="sm"
                />
              </div>
            </Tile>
          </div>
        </div>
      </PageContent>
    </>
  );
};

export default SummaryPage;

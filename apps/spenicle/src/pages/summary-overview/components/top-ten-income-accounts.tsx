import { useApiSpenicleAccountsPaginatedQuery, useApiSpenicleCachedAccounts } from '@dimasbaguspm/hooks/use-api';
import { AccountModel, SummaryAccountsModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Accordion, Hr, NoResults } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { AccountCard } from '../../../components/account-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface TopTenIncomeAccountsProps {
  data: SummaryAccountsModel;
}

export const TopTenIncomeAccounts: FC<TopTenIncomeAccountsProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const sortedData = data
    .filter((item) => item.income > 0)
    .sort((a, b) => b.income - a.income)
    .slice(0, 10);

  const cachedAccounts = useApiSpenicleCachedAccounts();

  const shouldFetchIds = sortedData
    .map((item) => item.accountId)
    .filter((id) => !cachedAccounts.find((acc) => acc.id === id));

  useApiSpenicleAccountsPaginatedQuery(
    {
      id: shouldFetchIds,
    },
    {
      enabled: Boolean(shouldFetchIds.length),
    },
  );

  const organizedData = sortedData.map((item) => ({
    ...item,
    account: cachedAccounts.find((acc) => acc.id === item.accountId),
  }));

  const handleOnAccountClick = (account: AccountModel) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId: account.id });
  };

  return (
    <div className="flex flex-col gap-1">
      <Accordion title={<Accordion.Title>Top Income Accounts ({organizedData.length})</Accordion.Title>}>
        <If condition={organizedData.length}>
          <ul className="flex flex-col ml-6 list-decimal">
            {organizedData.map((item, index) => {
              const isLastItem = index === organizedData.length - 1;
              return (
                <li key={item.accountId}>
                  <AccountCard
                    account={item.account as AccountModel}
                    onClick={handleOnAccountClick}
                    supplementaryInfo={formatPrice(item.income)}
                  />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>
        </If>
        <If condition={organizedData.length === 0}>
          <NoResults icon={SearchXIcon} title="No accounts found" />
        </If>
      </Accordion>
    </div>
  );
};

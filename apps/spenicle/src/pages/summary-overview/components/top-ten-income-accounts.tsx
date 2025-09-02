import { useApiSpenicleAccountsPaginatedQuery, useApiSpenicleCachedAccounts } from '@dimasbaguspm/hooks/use-api';
import { SummaryAccountsModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Accordion, Avatar, Card, Hr, NoResults } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

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

  const handleOnAccountClick = (accountId: number) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId });
  };

  return (
    <div className="flex flex-col gap-1">
      <Accordion title={<Accordion.Title>Top Income Accounts ({organizedData.length})</Accordion.Title>}>
        <If condition={organizedData.length}>
          <ul className="flex flex-col ml-6 list-decimal">
            {organizedData.map((item, index) => {
              const { initialName, name } = formatSpenicleAccount(item.account);
              const isLastItem = index === organizedData.length - 1;
              return (
                <li key={item.accountId}>
                  <Card
                    onClick={() => handleOnAccountClick(item.account?.id ?? 0)}
                    title={name}
                    subtitle={
                      <Card.List>
                        <Card.ListItem>{formatPrice(item.income)}</Card.ListItem>
                      </Card.List>
                    }
                    avatar={<Avatar shape="rounded">{initialName}</Avatar>}
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

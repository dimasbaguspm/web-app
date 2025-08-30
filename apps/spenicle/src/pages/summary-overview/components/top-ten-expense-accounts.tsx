import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCachedAccounts,
} from '@dimasbaguspm/hooks/use-api';
import { SummaryAccountsModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Card, NoResults, Text } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface TopTenExpenseAccountsProps {
  data: SummaryAccountsModel;
}

export const TopTenExpenseAccounts: FC<TopTenExpenseAccountsProps> = ({
  data,
}) => {
  const { openDrawer } = useDrawerRoute();
  const sortedData = data
    .filter((item) => item.expense > 0)
    .sort((a, b) => b.expense - a.expense)
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
      <Text fontWeight="semibold" fontSize="lg" className="mb-4">
        Top Expense Accounts
      </Text>
      <If condition={organizedData.length}>
        <ul className="flex flex-col ml-6 list-decimal">
          {organizedData.map((item) => {
            const { initialName, name } = formatSpenicleAccount(item.account);
            return (
              <li key={item.accountId} className="border-b border-border">
                <Card
                  onClick={() => handleOnAccountClick(item.account?.id ?? 0)}
                  title={name}
                  subtitle={
                    <Text
                      fontWeight="normal"
                      color="gray"
                      fontSize="sm"
                      className="flex-grow"
                      align="right"
                    >
                      {formatPrice(item.expense)}
                    </Text>
                  }
                  avatar={
                    <Avatar shape="rounded" size="lg">
                      {initialName}
                    </Avatar>
                  }
                />
              </li>
            );
          })}
        </ul>
      </If>
      <If condition={organizedData.length === 0}>
        <NoResults icon={SearchXIcon} title="No accounts found" />
      </If>
    </div>
  );
};

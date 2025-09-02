import { useApiSpenicleAccountsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableSingleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { debounce } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface SelectAccountDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectAccountDrawer: FC<SelectAccountDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    typeof payload?.[payloadId] === 'number' ? payload[payloadId] : null,
  );
  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useMemo(() => debounce((value: string) => setSearchValue(value), 1000), []);

  const [accounts, , { isFetching }] = useApiSpenicleAccountsPaginatedQuery({
    search: searchValue,
  });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedAccountId,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Account</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput defaultValue={searchValue} onChange={(e) => debouncedSetSearch(e.target.value)} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isFetching]}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[accounts?.items.length, !isFetching]}>
          <ul>
            {accounts?.items.map((account) => {
              const { type, variant } = formatSpenicleAccount(account);
              return (
                <li key={account.id}>
                  <SelectableSingleInput
                    label={
                      <div className="flex flex-col w-auto">
                        <Text className="mb-2" fontSize="base" fontWeight="semibold">
                          {account.name}
                        </Text>
                        <BadgeGroup>
                          <Badge color={variant} size="sm">
                            {type}
                          </Badge>
                        </BadgeGroup>
                      </div>
                    }
                    value={account.id.toString()}
                    checked={account.id === selectedAccountId}
                    onChange={() => setSelectedAccountId(account.id)}
                  />
                </li>
              );
            })}
          </ul>
        </If>

        <If condition={[!accounts?.items.length, !isFetching]}>
          <NoResults
            icon={SearchXIcon}
            title="No accounts found"
            subtitle="Try adjusting your search criteria, or create a new account"
            action={
              <ButtonGroup>
                <Button variant="outline" onClick={() => openDrawer(DRAWER_ROUTES.NEW_ACCOUNT)}>
                  Create Account
                </Button>
              </ButtonGroup>
            }
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-account-form" onClick={handleOnSubmit} disabled={!selectedAccountId}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

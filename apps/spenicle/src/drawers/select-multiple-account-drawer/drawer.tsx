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
  SelectableMultipleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { debounce } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface SelectMultipleAccountDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectMultipleAccountDrawer: FC<
  SelectMultipleAccountDrawerProps
> = ({ returnToDrawer, returnToDrawerId = null, payloadId, payload }) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>(
    typeof payload?.[payloadId] === 'number'
      ? [payload[payloadId]]
      : Array.isArray(payload?.[payloadId])
        ? payload[payloadId]
        : [],
  );
  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), 1000),
    [],
  );

  const [accounts, , { isFetching }] = useApiSpenicleAccountsPaginatedQuery({
    search: searchValue,
    type: ['expense', 'income'].includes(payload.type as string)
      ? [payload.type as 'expense' | 'income']
      : undefined,
  });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedAccountIds,
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
            <SearchInput
              defaultValue={searchValue}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
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
                  <SelectableMultipleInput
                    label={
                      <div className="flex flex-col w-auto">
                        <Text
                          className="mb-2"
                          fontSize="base"
                          fontWeight="semibold"
                        >
                          {account.name}
                        </Text>
                        <BadgeGroup>
                          <Badge color={variant} size="sm">
                            {type}
                          </Badge>
                        </BadgeGroup>
                      </div>
                    }
                    checked={selectedAccountIds.includes(account.id)}
                    value={account.id.toString()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccountIds([
                          ...selectedAccountIds,
                          account.id,
                        ]);
                      } else {
                        setSelectedAccountIds(
                          selectedAccountIds.filter((id) => id !== account.id),
                        );
                      }
                    }}
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
            subtitle="Try adjusting your search criteria, or create a new account."
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-account-form" onClick={handleOnSubmit}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};

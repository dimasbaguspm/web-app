import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DetailAccountDrawer } from '../drawers/detail-account-drawer/drawer';
import { DetailCategoryDrawer } from '../drawers/detail-category-drawer/drawer';
import { DetailTransactionDrawer } from '../drawers/detail-transaction-drawer/drawer';
import { EditAccountDrawer } from '../drawers/edit-account-drawer/drawer';
import { EditCategoryDrawer } from '../drawers/edit-category-drawer/drawer';
import { EditTransactionDrawer } from '../drawers/edit-transaction-drawer/drawer';
import { FilterSummaryDrawer } from '../drawers/filter-summary-drawer/drawer';
import { FilterTransactionDrawer } from '../drawers/filter-transaction-drawer/drawer';
import { NewAccountDrawer } from '../drawers/new-account-drawer/drawer';
import { NewCategoryDrawer } from '../drawers/new-category-drawer/drawer';
import { NewTransactionDrawer } from '../drawers/new-transaction-drawer/drawer';
import { SelectAccountDrawer } from '../drawers/select-account-drawer/drawer';
import { SelectCategoryDrawer } from '../drawers/select-category-drawer/drawer';

interface DrawerParams {
  appId?: string;
  accountId?: number;
  categoryId?: number;
  transactionId?: number;
  payloadId?: string;
}

interface DrawerState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, state, closeDrawer } = useDrawerRoute<
    DrawerParams,
    DrawerState
  >();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => param in params;
  const hasState = (stateKey: keyof typeof state) => stateKey in state;

  const disableInteractive = (
    [DRAWER_ROUTES.SELECT_ACCOUNT, DRAWER_ROUTES.SELECT_CATEGORY] as string[]
  ).includes(drawerId ?? '');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      size={isDesktop ? 'lg' : 'full'}
      transitionType={isDesktop ? 'slide' : 'fade'}
      disableOverlayClickToClose={disableInteractive}
      disableEscapeKeyDown={disableInteractive}
    >
      {is(DRAWER_ROUTES.NEW_ACCOUNT) && <NewAccountDrawer />}
      {is(DRAWER_ROUTES.ACCOUNT_DETAIL) && hasParam('accountId') && (
        <DetailAccountDrawer accountId={params.accountId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_ACCOUNT) && hasParam('accountId') && (
        <EditAccountDrawer accountId={params.accountId!} />
      )}
      {is(DRAWER_ROUTES.NEW_CATEGORY) && <NewCategoryDrawer />}
      {is(DRAWER_ROUTES.DETAIL_CATEGORY) && hasParam('categoryId') && (
        <DetailCategoryDrawer categoryId={params.categoryId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_CATEGORY) && hasParam('categoryId') && (
        <EditCategoryDrawer categoryId={params.categoryId!} />
      )}
      {is(DRAWER_ROUTES.NEW_TRANSACTION) && (
        <NewTransactionDrawer payload={state?.payload} />
      )}
      {is(DRAWER_ROUTES.DETAIL_TRANSACTION) && hasParam('transactionId') && (
        <DetailTransactionDrawer transactionId={params.transactionId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_TRANSACTION) && hasParam('transactionId') && (
        <EditTransactionDrawer
          transactionId={params.transactionId!}
          payload={state?.payload}
        />
      )}
      {is(DRAWER_ROUTES.FILTER_TRANSACTION) && <FilterTransactionDrawer />}
      {is(DRAWER_ROUTES.SELECT_ACCOUNT) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectAccountDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.SELECT_CATEGORY) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectCategoryDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.FILTER_SUMMARY) && <FilterSummaryDrawer />}
    </Drawer>
  );
};

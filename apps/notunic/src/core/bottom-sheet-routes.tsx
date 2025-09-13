import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { BottomSheet } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MenuBottomSheet } from '../bottom-sheets/menu-bottom-sheet/bottom-sheet';
import { BOTTOM_SHEET_ROUTES } from '../constants/bottom-sheet-routes';

interface BottomSheetParams {
  appId?: string;
  accountId?: number;
  categoryId?: number;
  transactionId?: number;
  payloadId?: string;
  tabId?: string;
}

interface BottomSheetState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const BottomSheetRoutes: FC = () => {
  const { isOpen, bottomSheetId, closeBottomSheet } = useBottomSheetRoute<BottomSheetParams, BottomSheetState>();

  const is = (id: string) => bottomSheetId === id;
  // const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  // const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  return (
    <BottomSheet isOpen={isOpen} onClose={closeBottomSheet}>
      {is(BOTTOM_SHEET_ROUTES.MENU) && <MenuBottomSheet />}
    </BottomSheet>
  );
};

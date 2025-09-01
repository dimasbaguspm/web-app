import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { BottomSheet } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MenuBottomSheet } from '../bottom-sheets/menu-bottom-sheet/bottom-sheet';
import { ProfileSwitcherBottomSheet } from '../bottom-sheets/profile-switcher-bottom-sheet/bottom-sheet';
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
  // const hasParam = (param: keyof typeof params) => param in params;
  //   const hasState = (stateKey: keyof typeof state) => stateKey in state;

  return (
    <BottomSheet isOpen={isOpen} onClose={closeBottomSheet}>
      {is(BOTTOM_SHEET_ROUTES.MENU) && <MenuBottomSheet />}
      {is(BOTTOM_SHEET_ROUTES.PROFILE_SWITCHER) && <ProfileSwitcherBottomSheet />}
    </BottomSheet>
  );
};

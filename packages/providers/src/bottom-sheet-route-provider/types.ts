export type BottomSheetParams = Record<string, string | number> | null;

export type BottomSheetState = {
  bottomSheetId?: string | null;
  params?: BottomSheetParams;
};

export type OpenBottomSheetOptions = {
  replace?: boolean;
  state?: BottomSheetState;
};

export type OpenBottomSheetFunc = <Params extends BottomSheetParams>(
  bottomSheetId: string,
  params?: Params,
  opts?: OpenBottomSheetOptions,
) => void;
export type CloseBottomSheetFunc = () => void;

export interface BottomSheetRouteModel<Params = BottomSheetParams, State = BottomSheetState> {
  isOpen: boolean;
  bottomSheetId: string | null;
  params: Params;
  state: State;
  openBottomSheet: OpenBottomSheetFunc;
  closeBottomSheet: CloseBottomSheetFunc;
}

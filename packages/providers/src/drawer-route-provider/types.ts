export type DrawerParams = Record<string, string | number> | null;

export type OpenDrawerFunc = <Params extends DrawerParams>(
  drawerId: string,
  params?: Params,
) => void;
export type CloseDrawerFunc = () => void;

export interface DrawerRouteModel<Params extends DrawerParams = DrawerParams> {
  isOpen: boolean;
  drawerId: string | null;
  params: Params;
  openDrawer: OpenDrawerFunc;
  closeDrawer: CloseDrawerFunc;
}

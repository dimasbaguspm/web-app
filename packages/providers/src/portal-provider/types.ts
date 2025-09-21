export interface PortalProviderModel {
  /**
   * A portal state objects to keep track of which portals are open
   */
  state: Record<string, boolean>;

  /**
   * Function to check if a portal with the given identifier is open
   */
  isOpen: (id: string) => boolean;

  /**
   * References to the DOM nodes where portals will be rendered
   */
  node: Record<string, HTMLElement | null>;

  /**
   * Function to set the DOM node for a portal by its identifier
   */
  setNode: (id: string, element: HTMLElement | null) => void;
}

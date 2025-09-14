import { DEEP_LINKS } from '../../constants/page-routes';

interface Link {
  title: string;
  path: string;
  icon: React.ComponentType;
}
export const LINKS: Link[] = [DEEP_LINKS.MARKETPLACE, DEEP_LINKS.GROUPS];

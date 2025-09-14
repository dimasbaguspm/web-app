import { DEEP_LINKS } from '../../constants/page-routes';

interface Link {
  title: string;
  path: string;
  icon: React.ComponentType;
}

export const getNavigationLinks = (isAdmin: boolean) => {
  const links: Link[] = [DEEP_LINKS.MARKETPLACE, DEEP_LINKS.GROUPS];

  if (isAdmin && !links.find((link) => link.path === DEEP_LINKS.ADMINS.path)) {
    links.push(DEEP_LINKS.ADMINS);
  }

  return links;
};

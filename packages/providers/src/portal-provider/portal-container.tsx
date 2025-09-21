import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { usePortalProvider } from './use-portal-provider';

interface PortalContainerProps {
  id: string;
}

export const PortalContainer: FC<PropsWithChildren<PortalContainerProps>> = ({ id, children }) => {
  const { node } = usePortalProvider();

  return createPortal(children, node[id] || document.body, id);
};

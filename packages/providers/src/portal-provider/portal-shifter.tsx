import { FC, ReactNode, useEffect, useRef } from 'react';

import { usePortalProvider } from './use-portal-provider';

interface PortalShifterProps {
  id: string;
  children: ReactNode;
}

export const PortalShifter: FC<PortalShifterProps> = ({ id, children }) => {
  const { setNode } = usePortalProvider();
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNode(id, nodeRef.current);
  }, [id, setNode]);

  return (
    <>
      {children}
      <div ref={nodeRef} />
    </>
  );
};

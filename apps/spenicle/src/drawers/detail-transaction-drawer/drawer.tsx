import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DetailTransactionDrawerProps {
  transactionId: number;
}

export const DetailTransactionDrawer: FC<DetailTransactionDrawerProps> = () => {
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <div>DetailTransactionDrawer</div>
      </Drawer.Body>
    </>
  );
};

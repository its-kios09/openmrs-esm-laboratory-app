import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const CompletedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="COMPLETED"
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
      excludeColumns={[]}
    />
  );
};

export default CompletedLabRequestsTable;

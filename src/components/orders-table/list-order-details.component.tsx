import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tile } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';
import { launchOverlay } from '../overlay/store';
import { ListOrdersDetailsProps } from '../../types';
import { useReactToPrint } from 'react-to-print';
import { OrderDetail } from './order-detail.component';
import ResultForm from '../../results/result-form.component';
import styles from './list-order-details.scss';
import { Printer } from '@carbon/react/icons';

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const { t } = useTranslation();
  const orders = props.groupedOrders?.orders;
  const patientId = props.groupedOrders?.patientId;
  const patientName = props?.patientName;
  const [isPrinting, setIsPrinting] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order Number - ${patientName}`,
    onBeforePrint() {
      setIsPrinting(true);
    },
    onAfterPrint() {
      setIsPrinting(false);
    },
    removeAfterPrint: true,
  });

  return (
    <div className={styles.ordersContainer} ref={componentRef}>
      {orders &&
        orders.map((row) => (
          <Tile className={styles.orderTile} key={row.uuid}>
            <div>
              <div className={styles.order__table} ref={componentRef}>
                <OrderDetail label={t('date', 'Date').toUpperCase()} value={row.dateActivated} />
                <OrderDetail label={t('orderNumber', 'Order number').toUpperCase()} value={row.orderNumber} />
                <OrderDetail label={t('labTest', 'Lab test').toUpperCase()} value={row.display} />
                <OrderDetail label={t('status', 'Status').toUpperCase()} value={row.fulfillerStatus} />
                <OrderDetail label={t('urgency', 'Urgency').toUpperCase()} value={row.urgency} />
                <OrderDetail label={t('orderer', 'Orderer').toUpperCase()} value={row.orderer?.display} />
                <OrderDetail label={t('instructions', 'Instructions').toUpperCase()} value={row.instructions} />
              </div>
              <div className={styles.actionBtns}>
                {props.actions
                  .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
                  .map((action) => {
                    if (action.actionName === 'pickupLabRequest') {
                      return (
                        <Button
                          kind="primary"
                          size="sm"
                          key={`${action.actionName}-${row.uuid}`}
                          onClick={() => {
                            const dispose = showModal('pickup-lab-request-modal', {
                              closeModal: () => dispose(),
                              order: row,
                            });
                          }}
                        >
                          {t('pickupLabRequest', 'Pick up lab request')}
                        </Button>
                      );
                    }
                    if (action.actionName === 'printOrder') {
                      return (
                        <Button
                          kind="secondary"
                          size="sm"
                          disabled={isPrinting}
                          renderIcon={Printer}
                          iconDescription="Add"
                          tooltipPosition="right"
                          key={`${action.actionName}-${row.uuid}`}
                          onClick={handlePrint}
                        >
                          {isPrinting ? t('printingOrder', 'Printing order...') : t('printOrder', 'Print Order')}
                        </Button>
                      );
                    }
                    if (action.actionName === 'labResultsForm') {
                      return (
                        <Button
                          key={`${action.actionName}-${row.uuid}`}
                          kind="primary"
                          size="sm"
                          onClick={() => {
                            launchOverlay(
                              t('labResultsForm', 'Lab results form'),
                              <ResultForm patientUuid={patientId} order={row} />,
                            );
                          }}
                        >
                          {t('labResultsForm', 'Lab results form')}
                        </Button>
                      );
                    }
                    if (action.actionName === 'rejectLabRequest') {
                      return (
                        <Button
                          key={`${action.actionName}-${row.uuid}`}
                          kind="danger"
                          onClick={() => {
                            const dispose = showModal('reject-lab-request-modal', {
                              closeModal: () => dispose(),
                              order: row,
                            });
                          }}
                        >
                          {t('rejectLabRequest', 'Reject lab request')}
                        </Button>
                      );
                    }
                  })}
              </div>
            </div>
          </Tile>
        ))}
    </div>
  );
};

export default ListOrderDetails;

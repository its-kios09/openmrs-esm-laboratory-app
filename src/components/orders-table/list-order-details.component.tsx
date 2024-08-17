import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Tile } from "@carbon/react";
import { showModal } from "@openmrs/esm-framework";
import { launchOverlay } from "../overlay/store";
import { ListOrdersDetailsProps } from "../../types";
import { OrderDetail } from "./order-detail.component";
import ResultForm from "../../results/result-form.component";
import styles from "./list-order-details.scss";

const ListOrderDetails: React.FC<ListOrdersDetailsProps> = (props) => {
  const orders = props.groupedOrders?.orders;
  const patientId = props.groupedOrders?.patientId;
  const { t } = useTranslation();
  return (
    <div className={styles.ordersContainer}>
      {orders &&
        orders.map((row) => (
          <Tile className={styles.orderTile}>
            <div>
              <div className={styles.actionBtns}>
                {props.actions
                  .sort((a, b) => {
                    // Replace 'property' with the actual property you want to sort by
                    if (a.order < b.order) return -1;
                    if (a.order > b.order) return 1;
                    return 0;
                  })
                  .map((action) => {
                    if (action.actionName === "pickupLabRequest") {
                      return (
                        <Button
                          kind="primary"
                          onClick={() => {
                            const dispose = showModal(
                              "pickup-lab-request-modal",
                              {
                                closeModal: () => dispose(),
                                order: row,
                              }
                            );
                          }}
                        >
                          {t("pickupLabRequest", "Pick up lab request")}
                        </Button>
                      );
                    }
                    if (action.actionName === "labResultsForm") {
                      return (
                        <Button
                          kind="primary"
                          onClick={() => {
                            launchOverlay(
                              t("labResultsForm", "Lab results form"),
                              <ResultForm patientUuid={patientId} order={row} />
                            );
                          }}
                        >
                          {t("labResultsForm", "Lab results form")}
                        </Button>
                      );
                    }
                    if (action.actionName === "rejectLabRequest") {
                      return (
                        <Button
                          kind="danger"
                          onClick={() => {
                            const dispose = showModal(
                              "reject-lab-request-modal",
                              {
                                closeModal: () => dispose(),
                                order: row,
                              }
                            );
                          }}
                        >
                          {t("rejectLabRequest", "Reject Lab Request")}
                        </Button>
                      );
                    }
                  })}
              </div>
              <div>
                <OrderDetail
                  label={t("date", "DATE").toUpperCase()}
                  value={row.dateActivated}
                />
                <OrderDetail
                  label={t("orderNumber", "Order number").toUpperCase()}
                  value={row.orderNumber}
                />
                <OrderDetail
                  label={t("procedure", "procedure").toUpperCase()}
                  value={row.display}
                />

                <OrderDetail
                  label={t("status", "Status").toUpperCase()}
                  value={row.fulfillerStatus}
                />
                <OrderDetail
                  label={t("urgency", "urgency").toUpperCase()}
                  value={row.urgency}
                />
                <OrderDetail
                  label={t("orderer", "orderer").toUpperCase()}
                  value={row.orderer}
                />
                <OrderDetail
                  label={t("instructions", "Instructions").toUpperCase()}
                  value={row.instructions}
                />
              </div>
            </div>
          </Tile>
        ))}
    </div>
  );
};

export default ListOrderDetails;
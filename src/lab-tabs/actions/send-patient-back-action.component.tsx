import { Order } from "@openmrs/esm-patient-common-lib";
import React from "react";
import { OverflowMenuItem } from "@carbon/react";
import { launchOverlay } from "../../components/overlay/store";
import ResultForm from "../../results/result-form.component";
import { useTranslation } from "react-i18next";
import styles from "./actions.scss";

const ReturnPatientBackToQueueAction: React.FC = () => {
  const { t } = useTranslation();

  return (
    <OverflowMenuItem
      itemText={t("sendBackPatient", "Send Back Patient")}
      //disabled={unSupportedStatuses.includes(order.fulfillerStatus)}
      className={styles.menuItem}
    />
  );
};

export default ReturnPatientBackToQueueAction;

import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const CompletedTile = () => {
  const { t } = useTranslation();

  const { count: completedCount } = useLabTestsStats("COMPLETED");

  return (
    <SummaryTile
      label={t("completed", "Completed")}
      value={completedCount}
      headerLabel={t("results", "Results")}
    />
  );
};

export default CompletedTile;

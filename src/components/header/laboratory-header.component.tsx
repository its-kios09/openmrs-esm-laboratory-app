import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chemistry } from '@carbon/react/icons';
import { Button } from '@carbon/react';
import { isDesktop, launchWorkspace, useLayoutType } from '@openmrs/esm-framework';
import styles from './laboratory-header.scss';

const MetricsHeader: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? 'sm' : 'md';

  const handleRequestLabOrderForm = () => {
    launchWorkspace('add-order-lab-form', {
      workspaceTitle: t('requestLabOrder', 'Request lab order'),
    });
  };

  return (
    <div className={styles.metricsContainer}>
      <span className={styles.metricsTitle}>{t('laboratoryMetrics', 'Laboratory metrics')}</span>
      <div className={styles.metricsContent}>
        <Button kind="primary" renderIcon={Chemistry} size={responsiveSize} onClick={() => handleRequestLabOrderForm()}>
          {t('addLabOrder', 'Add lab order')}
        </Button>
      </div>
    </div>
  );
};

export default MetricsHeader;

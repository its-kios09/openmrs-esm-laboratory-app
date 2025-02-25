import React from 'react';
import { Button, ButtonSet, Form, Stack, Column } from '@carbon/react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import styles from './add-order-lab.scss';
import { Autosuggest } from '../autosuggest/autosuggest.component';
import PatientSearchInfo from '../autosuggest/patient-search-info.component';
import SearchEmptyState from '../autosuggest/search-empty-state.component';
import { fetchPatientsWithActiveVisits } from './add-order.resource';
import { launchWorkspace, navigate, navigateAndLaunchWorkspace } from '@openmrs/esm-framework';
import {
  launchPatientChartWithWorkspaceOpen,
  launchPatientWorkspace,
  useLaunchWorkspaceRequiringVisit,
} from '@openmrs/esm-patient-common-lib';

const schema = z.object({
  activeVisitPatient: z.string().nonempty('Patient selection is required').uuid('Invalid patient selection'),
});

type AddLabOrderFormInputs = z.infer<typeof schema>;

const AddLabOrderForm: React.FC = () => {
  const { t } = useTranslation();

  const searchPatient = async (query: string) => {
    const abortController = new AbortController();

    return await fetchPatientsWithActiveVisits(query, abortController);
  };
  const form = useForm<AddLabOrderFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      activeVisitPatient: '',
    },
  });

  const { handleSubmit, control, formState } = form;

  const launchLabOrderWorkspace = (patientUuid: string) => {
    const patientChartUrl = '${openmrsSpaBase}/patient/' + `${patientUuid}/chart`;
    navigate({ to: patientChartUrl });
    launchWorkspace('order-basket', { patientUuid });
  };

  const onSuggestionSelected = (value: string) => {
    if (value) {
      launchLabOrderWorkspace(value);
    }
  };

  return (
    <Form className={styles.formContainer}>
      <Stack gap={4} className={styles.formGrid}>
        <Column className={styles.searchContainer}>
          <Controller
            control={control}
            name="activeVisitPatient"
            render={({ field }) => (
              <Autosuggest
                labelText={t('patient', 'Patient')}
                placeholder={t('searchPatientPlaceholder', 'Search for a patient')}
                invalid={!!formState.errors[field.name]?.message}
                invalidText={formState.errors[field.name]?.message}
                getDisplayValue={() => ''}
                renderSuggestionItem={(item) => <PatientSearchInfo patient={item.patient} />}
                getFieldValue={(item) => item.patient.uuid}
                getSearchResults={searchPatient}
                renderEmptyState={(value) => (
                  <SearchEmptyState searchValue={value} message={t('patientNotFound', 'Patient Not Found')} />
                )}
                onClear={() => field.onChange('')}
                onSuggestionSelected={(_, value) => {
                  onSuggestionSelected(value);
                  field.onChange(value);
                }}
              />
            )}
          />
        </Column>
      </Stack>
    </Form>
  );
};
export default AddLabOrderForm;

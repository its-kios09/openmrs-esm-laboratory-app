import { openmrsFetch, restBaseUrl, type Visit } from '@openmrs/esm-framework';
import type { Patient } from '../../types';

/**
 * Fetch patients with active visits.
 * @param query - The search query for patients.
 * @param abortController - The AbortController to cancel the request if needed.
 * @returns A promise resolving to an array of patients with active visits.
 */
export async function fetchPatientsWithActiveVisits(query: string, abortController: AbortController) {
  const customRepresentation = 'custom:(uuid,identifiers,person:(uuid,display,gender,age,birthdate,attributes))';

  const patientsResponse = await openmrsFetch<{ results: Array<Patient> }>(
    `${restBaseUrl}/patient?q=${query}&v=${customRepresentation}`,
    { signal: abortController.signal },
  );
  const patients = patientsResponse?.data?.results ?? [];

  const activePatients = await Promise.all(
    patients.map(async (patient) => {
      const visitResponse = await openmrsFetch<{ results: Array<Visit> }>(
        `${restBaseUrl}/visit?patient=${patient.uuid}&v=custom:(uuid,visitType,stopDatetime)`,
        { signal: abortController.signal },
      );
      const activeVisit = visitResponse?.data?.results.find((visit) => !visit.stopDatetime);

      if (activeVisit) {
        return { patient, visit: activeVisit };
      }
      return null;
    }),
  );

  return activePatients.filter((entry) => entry !== null);
}

import type { VaccineReport } from '$lib/models/vaccine/vaccine.schema';
import db from '../mongo';

export const vaccineReportsCollection = db.collection<VaccineReport>('vaccines-reports');

import type { DiseaseReport } from '$lib/models/disease/disease.schema';
import db from '../mongo';

export const diseaseReportsCollection = db.collection<DiseaseReport>('disease-reports');

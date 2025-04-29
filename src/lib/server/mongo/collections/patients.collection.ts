import db from '../mongo';
import type { Patient } from '$lib/models/patients/patient.type';

export default db.collection<Patient>('patients');

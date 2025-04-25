export enum Routes {
	Login = '/login',
	LoginApi = '/api/login',
	App = '/app',
	Dashboard = '/app/dashboard',
	DashboardApi = '/api/dashboard',
	DashboardStatsApi = '/api/dashboard/stats',
	Patients = '/app/patients',
	PatientsCreate = '/app/patients/create',
	PatientsApi = '/api/patients',
	VaccineReports = '/app/vaccine-reports',
	VaccineReportsCreate = '/app/vaccine-reports/create',
	VaccineReportsApi = '/api/vaccine/reports',
	DiseaseReports = '/app/disease-reports',
	DiseaseReportsCreate = '/app/disease-reports/create',
	DiseaseReportsApi = '/api/disease/reports',
	Users = '/app/users',
	UsersCreate = '/app/users/create'
}

export const PUBLIC_ROUTES = ['/', Routes.App, Routes.Login, Routes.LoginApi];

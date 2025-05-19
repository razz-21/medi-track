export enum Routes {
	Base = '/',
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
	VaccineReportsAnalysis = '/app/vaccine-reports/analysis',
	VaccineReportsCreate = '/app/vaccine-reports/create',
	VaccineReportsApi = '/api/vaccine/reports',
	DiseaseReports = '/app/disease-reports',
	DiseaseReportsCreate = '/app/disease-reports/create',
	DiseaseReportsApi = '/api/disease/reports',
	Users = '/app/users',
	UsersCreate = '/app/users/create',
	Profile = '/app/profile',
	ProfileApi = '/api/profile',
	SiteDisease = '/site/disease',
	SiteVaccine = '/site/vaccine'
}

export const PUBLIC_ROUTES = [
	'/',
	Routes.App,
	Routes.Login,
	Routes.LoginApi,
	Routes.SiteDisease,
	Routes.SiteVaccine
];

export enum Routes {
	Login = '/login',
	LoginApi = '/api/login',
	App = '/app',
	Dashboard = '/app/dashboard',
	Patients = '/app/patients',
	PatientsCreate = '/app/patients/create',
	PatientsApi = '/api/patients',
	Diagnosis = '/app/diagnosis',
	Users = '/app/users',
	UsersCreate = '/app/users/create'
}

export const PUBLIC_ROUTES = ['/', Routes.App, Routes.Login, Routes.LoginApi];

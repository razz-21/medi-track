<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { User } from '$lib/models/user/user.type';
	import { userStore } from '$lib/store/user.store';
	import type { Patient } from '$lib/models/patients/patient.type';
	import { patientsStore } from '$lib/store/patients.store';
	import { isAuthenticated } from '$lib/utils/auth.util';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto, preloadCode } from '$app/navigation';
	import { browser } from '$app/environment';

	let {
		children,
		data
	}: { children: Snippet; data: { user: User; patients: Promise<Patient[]> } } = $props();

	if (data.user) {
		$userStore = data.user;
	}

	if (browser) {
		preloadCode(Routes.Dashboard);
		preloadCode(Routes.VaccineReports);
		preloadCode(Routes.DiseaseReports);
		preloadCode(Routes.Patients);
		preloadCode(Routes.Users);
		preloadCode(Routes.Profile);
	}

	onMount(async () => {
		if (!isAuthenticated()) {
			goto(Routes.Login);
		}

		const patients = await data.patients;
		patientsStore.set(patients);
	});
</script>

{@render children()}

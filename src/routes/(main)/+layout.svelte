<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { User } from '$lib/models/user/user.type';
	import { userStore } from '$lib/store/user.store';
	import type { Patient } from '$lib/models/patients/patient.type';
	import { patientsStore } from '$lib/store/patients.store';
	import { isAuthenticated } from '$lib/utils/auth.util';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto } from '$app/navigation';

	let {
		children,
		data
	}: { children: Snippet; data: { user: User; patients: Promise<Patient[]> } } = $props();

	userStore.set(data.user);

	onMount(async () => {
		if (isAuthenticated()) {
			goto(Routes.Dashboard);
		} else {
			goto(Routes.Login);
		}

		const patients = await data.patients;
		patientsStore.set(patients);
	});
</script>

{@render children()}

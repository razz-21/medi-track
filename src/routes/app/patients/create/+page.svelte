<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import PatientForm from './PatientForm.svelte';

	function handleBack() {
		goto(Routes.Patients);
	}

	function handleSubmit() {
		console.log('submit');
	}
</script>

<div class="max-w-[900px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Create Patient</h2>
			<p class="text-xs text-gray-400">Create a new patient record</p>
		</div>
	</div>

	<div class="border border-gray-200 rounded-lg p-4">
		<PatientForm back={handleBack} submit={handleSubmit} />
	</div>
</div>

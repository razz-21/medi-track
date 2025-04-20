<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import PatientForm from './PatientForm.svelte';
	import type { PatientFormData } from './PatientForm.svelte';
	import { createPatienthandler } from '$lib/handler/patients/create-patient.handler';
	import { v4 as uuidv4 } from 'uuid';
	import { type PatientPost } from '$lib/models/patients/patient.type';
	import { toast } from 'svelte-sonner';

	let patientData = $state<PatientFormData>({} as PatientFormData);
	let loadingForm = $state(false);

	function handleBack() {
		goto(Routes.Patients);
	}

	async function handleSubmit() {
		const toastId = toast.loading('Creating patient...');
		loadingForm = true;
		try {
			const payload = {
				_id: uuidv4(),
				...patientData
			} as PatientPost;

			await createPatienthandler(payload);
			toast.success('Patient created successfully', { id: toastId });
			goto(Routes.Patients);
		} catch (error) {
			toast.error('Failed to create patient', { id: toastId });
		} finally {
			loadingForm = false;
		}
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
		<PatientForm bind:patientData back={handleBack} submit={handleSubmit} />
	</div>
</div>

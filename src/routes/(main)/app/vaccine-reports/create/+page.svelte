<script lang="ts">
	import { createVaccineReport } from '$lib/handler/vaccines/create-vaccine-report.handler';
	import VaccineReportForm, { initialVaccineReportData } from './VaccineReportForm.svelte';
	import type { VaccineReportDataForm } from './VaccineReportForm.svelte';
	import type { VaccineReportPost } from '$lib/models/vaccine/vaccine.schema';
	import { v4 as uuidv4 } from 'uuid';
	import { toast } from 'svelte-sonner';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/store/user.store';
	import type { Patient } from '$lib/models/patients/patient.type';
	import { patientsStore } from '$lib/store/patients.store';

	let vaccineReportData = $state(initialVaccineReportData as VaccineReportDataForm);
	let patients = $derived($patientsStore);
	let selectedPatient = $state<Patient | null>(null);
	let loading = $state(false);

	async function handleCreateVaccineReport() {
		const toastId = toast.loading('Creating vaccine report...');
		loading = true;
		try {
			const reportData = JSON.parse(JSON.stringify(vaccineReportData));
			const payload: VaccineReportPost = {
				_id: uuidv4(),
				patient_id: selectedPatient?._id,
				...reportData,
				details: [
					{
						_id: uuidv4(),
						...reportData.details
					}
				],
				created_by: $userStore?._id
			};

			await createVaccineReport(payload);
			toast.success('Vaccine report created successfully', { id: toastId });
			goto(Routes.VaccineReports);
		} catch (error) {
			console.error('Error creating vaccine report', error);
			toast.error('Failed to create vaccine report', { id: toastId });
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto(Routes.VaccineReports);
	}
</script>

<div class="max-w-[900px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Create Vaccine Report</h2>
			<p class="text-xs text-gray-400">Create a new vaccine report</p>
		</div>
	</div>

	<div class="border border-gray-200 rounded-lg p-4">
		<VaccineReportForm
			bind:vaccineReportData
			bind:selectedPatient
			bind:patients
			submit={handleCreateVaccineReport}
			cancel={handleCancel}
		/>
	</div>
</div>

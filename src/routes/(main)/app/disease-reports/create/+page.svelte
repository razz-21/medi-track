<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto } from '$app/navigation';
	import DiseaseReportForm, {
		type DiseaseReportDataForm,
		initialDiseaseReportData
	} from './DiseaseReportForm.svelte';
	import { patientsStore } from '$lib/store/patients.store';
	import { v4 as uuidv4 } from 'uuid';
	import { userStore } from '$lib/store/user.store';
	import type { DiseaseReportPost } from '$lib/models/disease/disease.schema';
	import { createDiseaseReportHandler } from '$lib/handler/diseases/create-disease-report.handler';
	import { toast } from 'svelte-sonner';

	let patients = $derived($patientsStore);
	let selectedPatient = $state(null);
	let diseaseReportData = $state<DiseaseReportDataForm>(initialDiseaseReportData);

	$inspect(diseaseReportData);

	function handleCancel() {
		goto(Routes.DiseaseReports);
	}

	async function handleCreateReport() {
		const toastId = toast.loading('Creating disease report...');
		try {
			const payload: DiseaseReportPost = {
				_id: uuidv4(),
				...JSON.parse(JSON.stringify(diseaseReportData)),
				created_by: $userStore?._id ?? ''
			};

			await createDiseaseReportHandler(payload);
			toast.success('Disease report created successfully', { id: toastId });
			goto(Routes.DiseaseReports);
		} catch (error) {
			console.error(error);
			toast.error('Failed to create disease report', { id: toastId });
		}
	}
</script>

<div class="max-w-[900px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Create Disease Report</h2>
			<p class="text-xs text-gray-400">Create a new disease report</p>
		</div>
	</div>

	<div class="border border-gray-200 rounded-lg p-4">
		<DiseaseReportForm
			bind:patients
			bind:selectedPatient
			bind:diseaseReportData
			negativeButtonText="Back"
			cancel={handleCancel}
			submit={handleCreateReport}
		/>
	</div>
</div>

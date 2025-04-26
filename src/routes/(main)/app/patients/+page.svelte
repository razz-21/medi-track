<script lang="ts">
	import { Plus, Pencil } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import Card from './Card.svelte';
	import PatientsDataTable from './PatientsDataTable.svelte';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { getPatientTableHandler } from '$lib/handler/patients/get-patient-table.handler';
	import { type PatientGetTable } from '$lib/models/patients/patient.type';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { debounce } from '$lib/utils/common.util';

	let patientsTable = $state<PatientGetTable>({} as PatientGetTable);
	let patients = $derived(patientsTable.patients);
	let loadingTable = $state(true);
	let page = $state(1);
	let limit = $state(10);
	let total = $derived(patientsTable.total ?? 0);
	let count = $derived(patientsTable.count ?? 0);
	let searchQuery = $state('');

	onMount(async () => {
		await fetchPatients();
	});

	const searchPatient = debounce(() => {
		fetchPatients();
	}, 300);

	async function fetchPatients() {
		loadingTable = true;
		try {
			patientsTable = await getPatientTableHandler({
				page,
				limit,
				...(searchQuery ? { q: searchQuery } : {})
			});
			total = patientsTable.total;
			count = patientsTable.count;
		} catch (error) {
			console.error(error);
			toast.error('Failed to fetch patients');
		} finally {
			loadingTable = false;
		}
	}

	function handlePageChange(pageChange: number) {
		page = pageChange;
		fetchPatients();
	}

	function handleDeletePatient(patient: PatientGetTable['patients'][0]) {
		console.log('Delete patient');
	}

	function handleCreatePatient() {
		goto(Routes.PatientsCreate);
	}
</script>

<div class="max-w-[1440px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">
				Patients <span class="text-sm text-gray-400">({count})</span>
			</h2>
			<p class="text-xs text-gray-400">List of all patients records</p>
		</div>

		<div class="flex items-center gap-2">
			<Button size="sm" on:click={handleCreatePatient}>
				<Plus class="w-4 h-4" />
				Add Patient
			</Button>
		</div>
	</div>

	<hr class="my-4" />

	{#if false}
		<div class="flex gap-4">
			<Card title="Total patients" value="20,000" color="bg-indigo-500" />
			<Card title="Total patients created this year" value="10,000" color="bg-blue-500" />
			<Card title="Total patients created this month" value="560" color="bg-green-500" />
			<Card title="Total patients created this week" value="120" color="bg-yellow-500" />
			<Card title="Total patients created today" value="4" color="bg-red-500" />
		</div>
	{/if}

	<div class="mt-4">
		<div class="flex flex-col gap-2">
			<Input
				class="max-w-sm bg-white"
				placeholder="Search patient name"
				type="text"
				bind:value={searchQuery}
				on:input={searchPatient}
			/>
			<PatientsDataTable
				bind:page
				bind:limit
				bind:total
				bind:loading={loadingTable}
				{patients}
				pageChange={handlePageChange}
				deletePatient={handleDeletePatient}
			/>
		</div>
	</div>
</div>

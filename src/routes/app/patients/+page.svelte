<script lang="ts">
	import { Plus, Pencil } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import Card from './Card.svelte';
	import PatientsDataTable from './PatientsDataTable.svelte';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';

	let searchQuery = $state('');

	function handleCreatePatient() {
		goto(Routes.PatientsCreate);
	}
</script>

<div class="max-w-[1440px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">Patients</h2>
			<p class="text-xs text-gray-400">List of all patients records</p>
		</div>

		<div class="flex items-center gap-2">
			<Button size="sm" on:click={handleCreatePatient}>
				<Plus class="w-4 h-4" />
				Add Patient
			</Button>
		</div>
	</div>

	<div class="flex gap-4">
		<Card title="Total patients" value="20,000" color="bg-indigo-500" />
		<Card title="Total patients created this year" value="10,000" color="bg-blue-500" />
		<Card title="Total patients created this month" value="560" color="bg-green-500" />
		<Card title="Total patients created this week" value="120" color="bg-yellow-500" />
		<Card title="Total patients created today" value="4" color="bg-red-500" />
	</div>

	<div class="mt-4">
		<div class="flex flex-col gap-2">
			<Input
				class="max-w-sm bg-white"
				placeholder="Search patient name"
				type="text"
				bind:value={searchQuery}
			/>
			<PatientsDataTable />
		</div>
	</div>
</div>

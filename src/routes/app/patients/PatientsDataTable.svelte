<script lang="ts" module>
	import {
		Table,
		TableHeader,
		TableHead,
		TableRow,
		TableCell,
		TableBody
	} from '$lib/components/ui/table/index.js';
	import PatientsDataTableActions from './PatientsDataTableActions.svelte';
	import PatientStatusPill from './PatientStatusPill.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';

	type Patient = {
		id: string;
		name: string;
		gender: string;
		status: string;
		dateOfBirth: string;
		createdAt: string;
	};
</script>

<script lang="ts">
	let pageIndex = $state(1);
	let pageCount = $state(10);
	let hasPreviousPage = $state(true);
	let hasNextPage = $state(true);

	const patients: Patient[] = [
		{
			id: '1',
			name: 'John Doe',
			gender: 'Male',
			status: 'active',
			dateOfBirth: '1990-01-01',
			createdAt: '2021-01-01'
		},
		{
			id: '2',
			name: 'Jane Doe',
			gender: 'Female',
			status: 'inactive',
			dateOfBirth: '1990-01-01',
			createdAt: '2021-01-01'
		}
	];

	function formateDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="rounded-md border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="font-medium text-xs text-gray-500">Name</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Gender</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Date of birth</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Status</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Created at</TableHead>
				<TableHead class="font-medium text-xs text-gray-500 w-[3rem]"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each patients as patient}
				<TableRow>
					<TableCell>
						<div
							role="button"
							tabindex="0"
							class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
							onclick={() => goto(`${Routes.Patients}/${patient.id}`)}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									goto(`${Routes.Patients}/${patient.id}`);
								}
							}}
						>
							{patient.name}
						</div>
					</TableCell>
					<TableCell>{patient.gender}</TableCell>
					<TableCell>{formateDate(patient.dateOfBirth)}</TableCell>
					<TableCell>
						<PatientStatusPill status={patient.status} />
					</TableCell>
					<TableCell>{formateDate(patient.createdAt)}</TableCell>
					<TableCell>
						<PatientsDataTableActions
							id={patient.id}
							viewPatient={() => {
								goto(`${Routes.Patients}/${patient.id}`);
							}}
							deletePatient={() => {}}
						/>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<div class="flex justify-between gap-4">
	<div class="ml-2">
		<p class="text-xs font-bold">
			Page {pageIndex + 1} of {pageCount}
		</p>
	</div>
	<div class="flex items-center justify-end space-x-2 py-2">
		<Button
			variant="outline"
			size="sm"
			on:click={() => (pageIndex = pageIndex - 1)}
			disabled={!hasPreviousPage}
		>
			<ChevronLeft class="w-3 h-3" />
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!hasNextPage}
			on:click={() => (pageIndex = pageIndex + 1)}
		>
			<ChevronRight class="w-3 h-3" />
		</Button>
	</div>
</div>

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
	import { type PatientGetTable } from '$lib/models/patients/patient.type';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export type Props = {
		patients: PatientGetTable['patients'];
		page: number;
		limit: number;
		total: number;
		loading: boolean;
		pageChange: (page: number) => void;
		deletePatient: (patient: PatientGetTable['patients'][0]) => void;
	};
</script>

<script lang="ts">
	let {
		patients = [],
		page = $bindable(1),
		limit = $bindable(10),
		total = $bindable(0),
		loading = $bindable(false),
		pageChange,
		deletePatient
	}: Props = $props();

	let pageIndex = $state(1);
	let pageCount = $state(10);
	let hasPreviousPage = $state(true);
	let hasNextPage = $state(true);

	$effect(() => {
		pageIndex = page;
		pageCount = Math.ceil(total / limit);
		hasPreviousPage = pageIndex > 1;
		hasNextPage = pageIndex < pageCount;
	});

	function formateDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formateDateLong(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		});
	}

	function handlePreviousPage() {
		handlePageChange(page - 1);
	}

	function handleNextPage() {
		handlePageChange(page + 1);
	}

	function handlePageChange(page: number) {
		pageChange(page);
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
			{#if loading}
				{#each Array(6) as _}
					<TableRow>
						{#each Array(6) as _}
							<TableCell>
								<Skeleton class="w-full h-6 rounded-md bg-slate-200" />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{:else if patients.length > 0}
				{#each patients as patient}
					<TableRow>
						<TableCell>
							<div
								role="button"
								tabindex="0"
								class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
								onclick={() => goto(`${Routes.Patients}/${patient._id}`)}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										goto(`${Routes.Patients}/${patient._id}`);
									}
								}}
							>
								{patient.firstname}
								{patient.lastname}
							</div>
						</TableCell>
						<TableCell>
							<div class="capitalize">
								{patient.gender}
							</div>
						</TableCell>
						<TableCell>{formateDate(patient.date_of_birth)}</TableCell>
						<TableCell>
							<PatientStatusPill status={patient.status} />
						</TableCell>
						<TableCell>{formateDateLong(patient.created_at)}</TableCell>
						<TableCell>
							<PatientsDataTableActions
								id={patient._id}
								viewPatient={() => {
									goto(`${Routes.Patients}/${patient._id}`);
								}}
								deletePatient={() => {
									deletePatient(patient);
								}}
							/>
						</TableCell>
					</TableRow>
				{/each}
			{:else}
				<TableRow>
					<TableCell colspan={6} class="text-center">
						<p class="text-sm text-gray-500">No patients found</p>
					</TableCell>
				</TableRow>
			{/if}
		</TableBody>
	</Table>
</div>

{#if !loading}
	<div class="flex justify-between items-center gap-4">
		<div class="ml-2">
			<p class="text-xs font-bold">Page {page} of {pageCount}</p>
		</div>
		<div class="flex items-center justify-end space-x-2 py-2">
			<Button
				variant="outline"
				size="sm"
				on:click={() => handlePreviousPage()}
				disabled={!hasPreviousPage}
			>
				<ChevronLeft class="w-3 h-3" />
			</Button>
			<Button variant="outline" size="sm" disabled={!hasNextPage} on:click={() => handleNextPage()}>
				<ChevronRight class="w-3 h-3" />
			</Button>
		</div>
	</div>
{/if}

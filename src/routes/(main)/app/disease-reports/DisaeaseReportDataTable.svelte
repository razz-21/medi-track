<script lang="ts" module>
	import {
		Table,
		TableHeader,
		TableHead,
		TableRow,
		TableCell,
		TableBody
	} from '$lib/components/ui/table/index.js';
	import DiseaseReportDataTableActions from './DiseaseReportDataTableActions.svelte';
	import DiseaseTypePill from './DiseaseTypePill.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { type DiseaseReportTable } from '$lib/models/disease/disease.schema';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { format } from 'date-fns';

	export type Props = {
		reports: DiseaseReportTable['reports'];
		page: number;
		limit: number;
		total: number;
		loading: boolean;
		pageChange: (page: number) => void;
	};
</script>

<script lang="ts">
	let {
		reports = [],
		page = $bindable(1),
		limit = $bindable(10),
		total = $bindable(0),
		loading = $bindable(false),
		pageChange
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
				<TableHead class="font-medium text-xs text-gray-500">Type</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">ICD Code</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Mode of Transmission</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Date Diagnosed</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Date Reported</TableHead>
				<TableHead class="font-medium text-xs text-gray-500">Created at</TableHead>
				<TableHead class="font-medium text-xs text-gray-500 w-[3rem]"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if loading}
				{#each Array(8) as _}
					<TableRow>
						{#each Array(8) as _}
							<TableCell>
								<Skeleton class="w-full h-6 rounded-md bg-slate-200" />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{:else if reports.length > 0}
				{#each reports as report}
					<TableRow>
						<TableCell>
							<div
								role="button"
								tabindex="0"
								class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
								onclick={() => goto(`${Routes.DiseaseReports}/${report._id}`)}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										goto(`${Routes.DiseaseReports}/${report._id}`);
									}
								}}
							>
								{report.patient.firstname}
								{report.patient.lastname}
							</div>
						</TableCell>
						<TableCell>
							<DiseaseTypePill diseaseType={report.disease_type} />
						</TableCell>
						<TableCell>
							<div class="capitalize">
								{report.icd_code}
							</div>
						</TableCell>
						<TableCell>
							<div class="capitalize">
								{report.mode_of_transmission}
							</div>
						</TableCell>
						<TableCell>{format(report.date_diagnosed, 'MMM d, yyyy')}</TableCell>
						<TableCell>{format(report.date_reported, 'MMM d, yyyy')}</TableCell>
						<TableCell>{format(report.created_at, 'MMM d, yyyy hh:mm a')}</TableCell>
						<TableCell>
							<DiseaseReportDataTableActions
								id={report._id}
								viewReport={() => {
									goto(`${Routes.DiseaseReports}/${report._id}`);
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

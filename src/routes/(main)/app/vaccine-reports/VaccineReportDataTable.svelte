<script lang="ts" module>
	import VaccineTypePill from './VaccineTypePill.svelte';
	import VaccineReportDataTableActions from './VaccineReportDataTableActions.svelte';

	type Props = {
		loading?: boolean;
		reports: VaccineReportGetTable['reports'];
		page: number;
		limit: number;
		total: number;
		pageChange: (page: number) => void;
	};
</script>

<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Table,
		TableHead,
		TableHeader,
		TableRow,
		TableBody,
		TableCell
	} from '$lib/components/ui/table';
	import { Routes } from '$lib/models/navigation/routes';
	import { goto } from '$app/navigation';
	import type { VaccineReportGetTable } from '$lib/models/vaccine/vaccine.schema';
	import { format } from 'date-fns';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	const {
		loading = $bindable(false),
		page = $bindable(1),
		limit = $bindable(10),
		total = $bindable(0),
		reports = $bindable([]),
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
				<TableHead class="text-xs font-medium">Patient name</TableHead>
				<TableHead class="text-xs font-medium">Vaccine type</TableHead>
				<TableHead class="text-xs font-medium">Description</TableHead>
				<TableHead class="text-xs font-medium">Created by</TableHead>
				<TableHead class="text-xs font-medium">Created at</TableHead>
				<TableHead class="text-xs font-medium"></TableHead>
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
			{:else if reports.length === 0}
				<TableRow>
					<TableCell colspan={6}>
						<p class="text-center text-sm font-medium text-gray-500">Reports not found</p>
					</TableCell>
				</TableRow>
			{:else}
				{#each reports as report}
					<TableRow>
						<TableCell>
							<div
								role="button"
								tabindex="0"
								class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
								onclick={() => goto(`${Routes.VaccineReports}/${report._id}`)}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										goto(`${Routes.VaccineReports}/${report._id}`);
									}
								}}
							>
								{report.patient.firstname}
								{report.patient.lastname}
							</div>
						</TableCell>
						<TableCell><VaccineTypePill vaccineType={report.type} /></TableCell>
						<TableCell>{report.description || '-'}</TableCell>
						<TableCell>{report.create_by_user.firstname} {report.create_by_user.lastname}</TableCell
						>
						<TableCell>{format(report.created_at, 'MMM d, yyyy h:mm a')}</TableCell>
						<TableCell>
							<VaccineReportDataTableActions
								id={report._id}
								viewReport={() => {
									goto(`${Routes.VaccineReports}/${report._id}`);
								}}
							/>
						</TableCell>
					</TableRow>
				{/each}
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

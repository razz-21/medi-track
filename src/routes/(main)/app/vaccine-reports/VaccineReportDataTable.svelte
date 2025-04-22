<script lang="ts" module>
	import VaccineTypePill from './VaccineTypePill.svelte';
	import VaccineReportDataTableActions from './VaccineReportDataTableActions.svelte';

	type Props = {
		loading?: boolean;
		reports: VaccineReportGetTable['reports'];
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

	const { loading = $bindable(false), reports = [] }: Props = $props();
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

<script lang="ts" module>
	import { VaccineTypeEnum, type VaccineReportGetTable } from '$lib/models/vaccine/vaccine.type';
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

	const { loading = $bindable(false), reports = [] }: Props = $props();
</script>

<div class="rounded-md border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Patient name</TableHead>
				<TableHead>Vaccine type</TableHead>
				<TableHead>Description</TableHead>
				<TableHead>Created by</TableHead>
				<TableHead>Created at</TableHead>
				<TableHead></TableHead>
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
				<!-- {:else if reports.length === 0}
        <TableRow>
          <TableCell colspan={6}>
            <p class="text-center text-sm font-medium text-gray-500">Reports not found</p>
          </TableCell>
        </TableRow> -->
			{:else}
				<!-- {#each reports as report}
          <TableRow>
            <TableCell>{report.patient_name}</TableCell>
          </TableRow>
        {/each} -->
				<TableRow>
					<TableCell>
						<div
							role="button"
							tabindex="0"
							class="hover:underline hover:underline-offset-4 hover:decoration hover:decoration-green-700 hover:underline-2 cursor-pointer"
							onclick={() => goto(`${Routes.VaccineReports}/1`)}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									goto(`${Routes.VaccineReports}/1`);
								}
							}}
						>
							Patient name
						</div>
					</TableCell>
					<TableCell><VaccineTypePill vaccineType={VaccineTypeEnum.HepaB1} /></TableCell>
					<TableCell>After 24 hours</TableCell>
					<TableCell>John Doe</TableCell>
					<TableCell>2021-01-01</TableCell>
					<TableCell>
						<VaccineReportDataTableActions
							id="1"
							viewReport={() => {
								goto(`${Routes.VaccineReports}/1`);
							}}
						/>
					</TableCell>
				</TableRow>
			{/if}
		</TableBody>
	</Table>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Routes } from '$lib/models/navigation/routes';
	import { Plus } from '@lucide/svelte';
	import VaccineReportDataTable from './VaccineReportDataTable.svelte';

	let loadingTable = $state(false);
	let count = $state(0);

	function handleCreateVaccineReport() {
		goto(Routes.VaccineReportsCreate);
	}
</script>

<div class="max-w-[1440px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">
				Vaccine Reports <span class="text-sm text-gray-400">({count})</span>
			</h2>
			<p class="text-xs text-gray-400">List of all vaccine reports records</p>
		</div>

		<div class="flex items-center gap-2">
			<Button size="sm" on:click={handleCreateVaccineReport}>
				<Plus class="w-4 h-4" />
				Create report
			</Button>
		</div>
	</div>

	<hr class="my-4" />

	<div class="mt-4">
		<div class="flex flex-col gap-2">
			<!-- <Input
      
      /> -->
		</div>

		<VaccineReportDataTable loading={loadingTable} reports={[]} />
	</div>
</div>

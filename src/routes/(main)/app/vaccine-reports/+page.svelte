<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Routes } from '$lib/models/navigation/routes';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import VaccineReportDataTable from './VaccineReportDataTable.svelte';
	import type { VaccineReportGetTable } from '$lib/models/vaccine/vaccine.schema';
	import { getVaccinReportsTable } from '$lib/handler/vaccines/get-vaccin-reports-table.hander';
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { debounce } from '$lib/utils/common.util';

	let loadingTable = $state(false);
	let vaccineReportsTable = $state<VaccineReportGetTable>({} as VaccineReportGetTable);
	let vaccineReports = $derived(vaccineReportsTable.reports ?? []);
	let page = $state(1);
	let limit = $state(10);
	let total = $derived(vaccineReportsTable.total ?? 0);
	let count = $derived(vaccineReportsTable.count ?? 0);
	let searchQuery = $state('');

	onMount(async () => {
		await fetchVaccineReportsTable();
	});

	function handleCreateVaccineReport() {
		goto(Routes.VaccineReportsCreate);
	}

	async function fetchVaccineReportsTable() {
		loadingTable = true;
		try {
			vaccineReportsTable = await getVaccinReportsTable({
				page,
				limit,
				...(searchQuery ? { q: searchQuery } : {})
			});
		} catch (error) {
			console.error(error);
		} finally {
			loadingTable = false;
		}
	}

	const searchVaccineReports = debounce(() => {
		fetchVaccineReportsTable();
	}, 300);

	function handlePageChange(pageChange: number) {
		page = pageChange;
		fetchVaccineReportsTable();
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
		<div class="flex flex-col gap-2 mb-2">
			<div class="w-1/3 relative">
				<div class="absolute" style="left: 10px; top: 50%; transform: translateY(-50%);">
					<SearchIcon class="text-gray-900 w-4 h-4" />
				</div>
				<Input
					bind:value={searchQuery}
					type="search"
					name="vaccine-report-search"
					placeholder="Search by patient name"
					class="pl-8"
					oninput={searchVaccineReports}
				/>
			</div>
		</div>
		<VaccineReportDataTable
			bind:loading={loadingTable}
			bind:page
			bind:limit
			bind:total
			reports={vaccineReports}
			pageChange={handlePageChange}
		/>
	</div>
</div>

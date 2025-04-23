<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { Input } from '$lib/components/ui/input';
	import { debounce } from '$lib/utils/common.util';
	import type {
		DiseaseReportTable,
		DiseaseReportTableParams
	} from '$lib/models/disease/disease.schema';
	import DiseaseReportDataTable from './DisaeaseReportDataTable.svelte';
	import { getDiseaseReportsTable } from '$lib/handler/diseases/get-disease-reports-table.handler';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let diseaseReportTable = $state<DiseaseReportTable>({} as DiseaseReportTable);
	let loadingTable = $state(false);
	let page = $state(1);
	let limit = $state(10);
	let count = $derived(diseaseReportTable.count ?? 0);
	let total = $derived(diseaseReportTable.total ?? 0);
	let diseaseReports = $derived(diseaseReportTable.reports ?? []);
	let searchQuery = $state('');

	onMount(async () => {
		await fetchDiseaseReportsTable();
	});

	function handleCreateDiseaseReport() {
		goto(Routes.DiseaseReportsCreate);
	}

	const searchDiseaseReports = debounce(() => {
		fetchDiseaseReportsTable();
	}, 300);

	async function fetchDiseaseReportsTable() {
		loadingTable = true;
		try {
			const params: DiseaseReportTableParams = {
				page: page,
				limit: limit,
				...(searchQuery ? { q: searchQuery } : {})
			};

			diseaseReportTable = await getDiseaseReportsTable(params);
			console.log(diseaseReportTable);
		} catch (error) {
			toast.error('Failed to fetch disease reports table');
			console.error(error);
		} finally {
			loadingTable = false;
		}
	}

	function handlePageChange(page: number) {
		page = page;
		fetchDiseaseReportsTable();
	}
</script>

<div class="max-w-[1440px]">
	<div class="flex items-center justify-between mt-4 mb-6">
		<div>
			<h2 class="text-2xl font-bold">
				Disease Reports <span class="text-sm text-gray-400">({count})</span>
			</h2>
			<p class="text-xs text-gray-400">List of all disease reports records</p>
		</div>

		<div class="flex items-center gap-2">
			<Button size="sm" on:click={handleCreateDiseaseReport}>
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
					oninput={searchDiseaseReports}
				/>
			</div>
		</div>
		<DiseaseReportDataTable
			bind:loading={loadingTable}
			bind:page
			bind:limit
			bind:total
			reports={diseaseReports}
			pageChange={handlePageChange}
		/>
	</div>
</div>

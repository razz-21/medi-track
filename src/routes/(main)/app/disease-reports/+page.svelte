<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import { Input } from '$lib/components/ui/input';
	import { debounce } from '$lib/utils/common.util';
	import type { DiseaseReportTable } from '$lib/models/disease/disease.schema';
	import {
		DiseaseICDCodeEnum,
		DiseaseModeTransmissionEnum,
		DiseaseTypeEnum
	} from '$lib/models/disease/disease.type';
	import { GenderEnum } from '$lib/models/common/common.types';
	import { PatientStatusEnum } from '$lib/models/patients/patient.type';
	import DiseaseReportDataTable from './DisaeaseReportDataTable.svelte';

	let diseaseReportTable = $state<DiseaseReportTable>({} as DiseaseReportTable);
	let count = $state(0);
	let loadingTable = $state(false);
	let page = $state(1);
	let limit = $state(10);
	let total = $state(0);
	let diseaseReports = $derived(diseaseReportTable.reports ?? []);
	let searchQuery = $state('');

	const diseaseReportsTable = $state<DiseaseReportTable>({
		total: 0,
		count: 0,
		reports: [
			{
				_id: '',
				patient_id: '',
				disease_type: DiseaseTypeEnum.Dengue,
				icd_code: DiseaseICDCodeEnum.Dengue,
				mode_of_transmission: DiseaseModeTransmissionEnum.Airborne,
				date_diagnosed: new Date().toISOString(),
				date_reported: new Date().toISOString(),
				remarks: '',
				created_by: '',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				patient: {
					_id: '',
					firstname: 'Leonardo',
					lastname: 'Dela Cruz',
					middlename: '',
					gender: GenderEnum.FEMALE,
					date_of_birth: '',
					contact_number: '',
					address: '',
					weight: 0,
					height: 0,
					blood_type: '',
					status: PatientStatusEnum.ACTIVE,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					relevant_information: null
				},
				created_user_by: {
					_id: '',
					firstname: '',
					lastname: '',
					username: '',
					role: 'Encoder',
					password: '',
					status: 'Active',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			}
		],
		page: 1,
		limit: 10
	});

	function handleCreateDiseaseReport() {
		goto(Routes.DiseaseReportsCreate);
	}

	const searchDiseaseReports = debounce(() => {
		// fetchDiseaseReportsTable();
	}, 300);

	function handlePageChange(page: number) {
		page = page;
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
			reports={diseaseReportsTable.reports}
			pageChange={handlePageChange}
		/>
	</div>
</div>

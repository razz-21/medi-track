<script lang="ts" module>
	import type { DiseaseReportGet } from '$lib/models/disease/disease.schema';
	import { format } from 'date-fns';
	import DiseaseTypePill from '../DiseaseTypePill.svelte';

	type Props = {
		report: DiseaseReportGet;
	};
</script>

<script lang="ts">
	let { report }: Props = $props();

	let userCreatedBy = $derived(
		report.created_user_by
			? `${report.created_user_by.firstname} ${report.created_user_by.lastname}`
			: '-'
	);
</script>

<div class="border border-dashed border-gray-300 rounded-lg p-4">
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Disease Type</div>
				<div class="text-sm font-medium mt-1">
					<DiseaseTypePill diseaseType={report.disease_type} />
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">ICD Code</div>
				<div class="text-sm font-medium">{report.icd_code}</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Mode of Transmission</div>
				<div class="text-sm font-medium">{report.mode_of_transmission}</div>
			</div>
		</div>

		<div class="flex gap-4">
			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Date Diagnosed</div>
				<div class="text-sm font-medium">
					{format(new Date(report.date_diagnosed), 'MMM d, yyyy')}
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Date Reported</div>
				<div class="text-sm font-medium">
					{format(new Date(report.date_reported), 'MMM d, yyyy')}
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Remarks</div>
				<div class="text-sm font-medium">{report.remarks || '-'}</div>
			</div>
		</div>

		<hr />

		<div class="flex gap-4">
			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Created By</div>
				<div class="text-sm font-medium">
					{userCreatedBy}
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Created At</div>
				<div class="text-sm font-medium">
					{format(new Date(report.created_at), 'MMM d, yyyy hh:mm a')}
				</div>
			</div>

			<div class="w-1/3 flex flex-col">
				<div class="text-xs font-bold text-gray-500">Updated At</div>
				<div class="text-sm font-medium">
					{format(new Date(report.updated_at), 'MMM d, yyyy hh:mm a')}
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts" module>
	import type { DiseaseReport } from '$lib/models/disease/disease.schema';
	import { format } from 'date-fns';
	import DiseaseTypePill from '../../disease-reports/DiseaseTypePill.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';

	type Props = {
		diseaseHistory: DiseaseReport[];
	};

	function handleViewDisease(id: string) {
		goto(`${Routes.DiseaseReports}/${id}`);
	}
</script>

<script lang="ts">
	const { diseaseHistory }: Props = $props();
</script>

<div class="flex flex-col gap-2 overflow-y-auto h-full border border-gray-200 rounded-lg p-4">
	<h2 class="text-sm font-medium mb-2">Disease cases</h2>

	{#each diseaseHistory as disease}
		<div
			class="flex items-center justify-between gap-4 border py-3 px-3 bg-white border-gray-200 rounded-lg hover:bg-slate-50"
		>
			<div class="flex flex-col gap-1">
				<div class="text-sm flex items-center gap-2">
					<DiseaseTypePill diseaseType={disease.disease_type} />
				</div>
				<div class="text-xs text-gray-500">
					{format(new Date(disease.date_diagnosed), 'MMM d, yyyy')}
				</div>
			</div>

			<div
				role="button"
				tabindex="0"
				onclick={() => handleViewDisease(disease._id)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						handleViewDisease(disease._id);
					}
				}}
			>
				<ArrowRight class="w-4 h-4 text-gray-500 hover:cursor-pointer" />
			</div>
		</div>
	{/each}

	{#if diseaseHistory.length === 0}
		<div class="text-sm text-gray-500 text-center">No disease cases found</div>
	{/if}
</div>

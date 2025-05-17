<script lang="ts" module>
	import type { VaccineReport } from '$lib/models/vaccine/vaccine.schema';
	import { format } from 'date-fns';
	import DiseaseTypePill from '../../disease-reports/DiseaseTypePill.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/models/navigation/routes';
	import VaccineTypePill from '../../vaccine-reports/VaccineTypePill.svelte';

	type Props = {
		vaccineHistory: VaccineReport[];
	};

	function handleViewVaccine(id: string) {
		goto(`${Routes.VaccineReports}/${id}`);
	}
</script>

<script lang="ts">
	const { vaccineHistory }: Props = $props();
</script>

<div class="flex flex-col gap-2 overflow-y-auto h-full border border-gray-200 rounded-lg p-4">
	<h2 class="text-sm font-medium mb-2">Vaccine cases</h2>

	{#each vaccineHistory as vaccine}
		<div
			class="flex items-center justify-between gap-4 border py-3 px-3 bg-white border-gray-200 rounded-lg hover:bg-slate-50"
		>
			<div class="flex flex-col gap-1">
				<div class="text-sm flex items-center gap-2">
					<VaccineTypePill vaccineType={vaccine.type} />
				</div>
				<div class="text-xs text-gray-500">
					{format(new Date(vaccine?.created_at), 'MMM d, yyyy')}
				</div>
			</div>

			<div
				role="button"
				tabindex="0"
				onclick={() => handleViewVaccine(vaccine._id)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						handleViewVaccine(vaccine._id);
					}
				}}
			>
				<ArrowRight class="w-4 h-4 text-gray-500 hover:cursor-pointer" />
			</div>
		</div>
	{/each}

	{#if vaccineHistory.length === 0}
		<div class="text-sm text-gray-500 text-center">No vaccine cases found</div>
	{/if}
</div>

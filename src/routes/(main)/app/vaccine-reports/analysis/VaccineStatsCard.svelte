<script lang="ts" module>
	import VaccineTypePill from '../VaccineTypePill.svelte';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import type { VaccineAnalysis } from '$lib/models/vaccine/vaccine.schema';
	type Props = {
		stats: VaccineAnalysis['stats'] | null;
	};
</script>

<script lang="ts">
	const { stats }: Props = $props();
</script>

<div class="border border-gray-200 rounded-md p-2 mt-20 flex flex-col gap-2">
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.Covid19} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_covid19_unvaccinated}</div>
	</div>
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.BCG} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_bcg_unvaccinated}</div>
	</div>
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.HepaB1} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_hepa_b1_unvaccinated}</div>
	</div>
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.MMR} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_mmr_unvaccinated}</div>
	</div>
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.PCV} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_pcv_unvaccinated}</div>
	</div>
	<div class="flex items-center justify-between border border-gray-200 p-2 rounded-md">
		<VaccineTypePill vaccineType={VaccineTypeEnum.Polio} />
		<div class="text-2xl font-bold text-green-900">{stats?.total_polio_unvaccinated}</div>
	</div>
</div>

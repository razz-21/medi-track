<script lang="ts">
	import PatientNeedsVaccineTable from './PatientNeedsVaccineTable.svelte';
	import VaccineStatsCard from './VaccineStatsCard.svelte';
	import { getVaccineAnalysis } from '$lib/handler/vaccines/get-vaccine-analysis.handler';
	import { onMount } from 'svelte';
	import type { VaccineAnalysis } from '$lib/models/vaccine/vaccine.schema';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let analysis = $state<VaccineAnalysis | null>(null);
	let loading = $state(false);

	onMount(async () => {
		await fetchAnalysis();
	});

	async function fetchAnalysis() {
		loading = true;
		analysis = await getVaccineAnalysis();
		loading = false;
	}
</script>

{#if !loading}
	<div class="grid grid-cols-4 gap-4">
		<div class="col-span-3">
			<PatientNeedsVaccineTable vaccineAnalysis={analysis} />
		</div>
		<div class="col-span-1">
			<VaccineStatsCard stats={analysis?.stats ?? null} />
		</div>
	</div>
{:else}
	{#each Array(6) as _}
		<Skeleton class="w-full h-6 rounded-md bg-slate-200" />
	{/each}
{/if}

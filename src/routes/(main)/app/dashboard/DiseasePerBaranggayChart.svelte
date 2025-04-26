<script lang="ts" module>
	import type { DashboardStatsGet } from '$lib/models/dashboard/dashboard.schema';
	import { BaranggayEnum } from '$lib/models/common/common.types';
	type Props = {
		diseasedBrgyStats: DashboardStatsGet['diseased_brgy_stats'];
	};
</script>

<script lang="ts">
	let { diseasedBrgyStats }: Props = $props();

	let brgys = $derived(Object.values(BaranggayEnum));

	let data = $derived(() => {
		const dataPerBrgy: { name: string; value: number }[] = [];

		brgys.forEach((brgy) => {
			const brgyData = diseasedBrgyStats.find((brgyData) => brgyData.brgy === brgy);

			if (brgyData) {
				dataPerBrgy.push({
					name: brgyData.brgy,
					value: brgyData.value
				});
			} else {
				dataPerBrgy.push({
					name: brgy,
					value: 0
				});
			}
		});

		return dataPerBrgy.sort((a, b) => {
			if (a.name === 'Others') return 1;
			if (b.name === 'Others') return -1;
			return a.name.localeCompare(b.name);
		});
	});

	$inspect(data());
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Diseased per brgy</h3>

	<div class="flex items-center justify-between mt-4">
		<div class="flex flex-col gap-2 w-full">
			{#each data() as item, index}
				{@const isLast = index === data().length - 1}
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-1">
						<div class="flex items-center gap-1 text-sm">
							<div class="w-3 h-3 bg-green-400 rounded-sm"></div>
							<div>{item.name}</div>
						</div>
						<div class="text-sm font-medium">{item.value}</div>
					</div>
					{#if !isLast}
						<hr />
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

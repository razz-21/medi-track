<script lang="ts" module>
	import type { DashboardStatsGet } from '$lib/models/dashboard/dashboard.schema';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import {
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		LinearScale,
		TimeScale,
		Tooltip,
		type ChartDataset,
		type ChartOptions
	} from 'chart.js';
	import 'chart.js/auto';
	import { onMount } from 'svelte';

	type Props = {
		vaccineStats: DashboardStatsGet['vaccine_stats'];
	};
</script>

<script lang="ts">
	let { vaccineStats }: Props = $props();

	let vaccineTypes = $derived(Object.values(VaccineTypeEnum));
	let vaccineTypesColor = $state({
		[VaccineTypeEnum.Covid19]: 'rgb(134, 239, 172)',
		[VaccineTypeEnum.BCG]: 'rgb(125, 211, 252)',
		[VaccineTypeEnum.Polio]: 'rgb(196, 181, 253)',
		[VaccineTypeEnum.HepaB1]: 'rgb(252, 211, 77)',
		[VaccineTypeEnum.PCV]: 'rgb(147, 197, 253)',
		[VaccineTypeEnum.MMR]: 'rgb(252, 165, 165)'
	});

	const options: ChartOptions = {
		scales: {
			x: {
				display: false
			},
			y: {
				display: false
			}
		},
		plugins: {
			legend: {
				display: false
			}
		},
		maintainAspectRatio: false
	};

	let data = $derived(() => {
		const labels = vaccineTypes;
		const datasets: ChartDataset[] = [
			{
				data: [],
				backgroundColor: [],
				borderRadius: 8
			}
		];

		vaccineTypes.forEach((vaccineType) => {
			const vaccineDataset = vaccineStats.find((stat) => stat.type === vaccineType);
			if (vaccineDataset) {
				(datasets[0].data as number[]).push(vaccineDataset.value ?? 0);
			} else {
				(datasets[0].data as number[]).push(0);
			}

			(datasets[0].backgroundColor as string[]).push(vaccineTypesColor[vaccineType]);
		});

		return {
			labels: labels,
			datasets: datasets
		};
	});

	let datasets = $derived(data().datasets);

	let canvasElement: HTMLCanvasElement;
	let chart: Chart;

	Chart.register(Tooltip, BarElement, BarController, CategoryScale, LinearScale, TimeScale);

	onMount(() => {
		chart = new Chart(canvasElement, {
			type: 'doughnut',
			data: data(),
			options: options
		});
	});
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Vaccines stats</h3>
	<div class="flex items-center justify-between mt-2">
		<div class="flex flex-col gap-2">
			{#each datasets[0]?.data ?? [] as data, index}
				<div class="flex items-center gap-2 text-xs">
					<div
						class="w-2 h-2 rounded-full"
						style="background-color: {(datasets[0]?.backgroundColor as string[])?.[index]}"
					></div>
					<span>{vaccineTypes[index]} - <strong>{data}%</strong></span>
				</div>
			{/each}
		</div>
		<div>
			<canvas bind:this={canvasElement}></canvas>
		</div>
	</div>
</div>

<style>
	canvas {
		height: 180px;
		width: 180px;
	}
</style>

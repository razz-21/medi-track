<script lang="ts" module>
	import type { DashboardStatsGet } from '$lib/models/dashboard/dashboard.schema';
	import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';
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
		dashboardStats: DashboardStatsGet['disease_stats'];
	};
</script>

<script lang="ts">
	let { dashboardStats }: Props = $props();

	let diseaseTypes = $derived(Object.values(DiseaseTypeEnum));
	let diseaseTypesColor = $state({
		[DiseaseTypeEnum.Dengue]: 'rgb(56, 189, 248)',
		[DiseaseTypeEnum.Flu]: 'rgb(74, 222, 128)',
		[DiseaseTypeEnum.HIV]: 'rgb(251, 191, 36)',
		[DiseaseTypeEnum.Influenza]: 'rgb(248, 113, 113)',
		[DiseaseTypeEnum.TB]: 'rgb(167, 139, 250)'
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
		const labels = diseaseTypes;
		const datasets: ChartDataset[] = [
			{
				data: [],
				backgroundColor: [],
				borderRadius: 8
			}
		];

		diseaseTypes.forEach((diseaseType) => {
			const diseaseDataset = dashboardStats.find((stat) => stat.type === diseaseType);
			if (diseaseDataset) {
				(datasets[0].data as number[]).push(diseaseDataset.value ?? 0);
			} else {
				(datasets[0].data as number[]).push(0);
			}

			(datasets[0].backgroundColor as string[]).push(diseaseTypesColor[diseaseType]);
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

	$effect(() => {
		chart.data = data();
		chart.update('show');
	});
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Diseases stats</h3>
	<div class="flex items-center justify-between mt-2">
		<div class="flex flex-col gap-2">
			{#each datasets[0]?.data ?? [] as data, index}
				<div class="flex items-center gap-2 text-xs">
					<div
						class="w-2 h-2 rounded-full"
						style="background-color: {(datasets[0]?.backgroundColor as string[])?.[index]}"
					></div>
					<span>{diseaseTypes[index]} - <strong>{data}%</strong></span>
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

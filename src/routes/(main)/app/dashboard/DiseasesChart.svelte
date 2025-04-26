<script lang="ts" module>
	import type { DashboardGet } from '$lib/models/dashboard/dashboard.schema';
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
		disease_datasets: DashboardGet['disease_datasets'];
	};
</script>

<script lang="ts">
	let { disease_datasets }: Props = $props();

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
				border: {
					display: false
				},
				grid: {
					display: false
				}
			},
			y: {
				ticks: {
					precision: 0
				},
				beginAtZero: true,
				min: 0,
				suggestedMax: 4
			}
		},
		maintainAspectRatio: false
	};

	let data = $derived(() => {
		const labels = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		const datasets: ChartDataset[] = [];

		diseaseTypes.forEach((diseaseType) => {
			const dataset = disease_datasets.find((dataset) => dataset.type === diseaseType);
			if (dataset) {
				datasets.push({
					label: dataset.type,
					data: dataset.value.map((v) => v.value),
					backgroundColor: diseaseTypesColor[diseaseType],
					borderColor: diseaseTypesColor[diseaseType],
					borderWidth: 1,
					borderRadius: 4,
					borderSkipped: false
				});
			} else {
				datasets.push({
					label: diseaseType,
					data: labels.map(() => 0),
					backgroundColor: diseaseTypesColor[diseaseType],
					borderColor: diseaseTypesColor[diseaseType],
					borderWidth: 1,
					borderRadius: 4,
					borderSkipped: false
				});
			}
		});

		return {
			labels: labels,
			datasets: datasets
		};
	});

	let canvasElement: HTMLCanvasElement;
	let chart: Chart;

	Chart.register(Tooltip, BarElement, BarController, CategoryScale, LinearScale, TimeScale);

	onMount(() => {
		chart = new Chart(canvasElement, {
			type: 'bar',
			data: data(),
			options: options
		});
	});

	$effect(() => {
		if (chart && disease_datasets) {
			chart.data = data();
			chart.update('show');
		}
	});
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Diseases chart</h3>
	<div>
		<canvas bind:this={canvasElement}></canvas>
	</div>
</div>

<style>
	canvas {
		height: 400px;
		width: 100%;
	}
</style>

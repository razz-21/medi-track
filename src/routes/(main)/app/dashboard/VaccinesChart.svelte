<script lang="ts" module>
	import type { DashboardGetSchema } from '$lib/models/dashboard/dashboard.schema';
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
		vaccine_datasets: DashboardGetSchema['vaccine_datasets'];
	};
</script>

<script lang="ts">
	let { vaccine_datasets }: Props = $props();

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
				suggestedMax: 5
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

		vaccineTypes.forEach((vaccineType) => {
			const dataset = vaccine_datasets.find((dataset) => dataset.type === vaccineType);
			if (dataset) {
				datasets.push({
					label: dataset.type,
					data: dataset.value.map((v) => v.value),
					backgroundColor: vaccineTypesColor[vaccineType],
					borderColor: vaccineTypesColor[vaccineType],
					borderWidth: 1,
					borderRadius: 4,
					borderSkipped: false
				});
			} else {
				datasets.push({
					label: vaccineType,
					data: labels.map(() => 0),
					backgroundColor: vaccineTypesColor[vaccineType],
					borderColor: vaccineTypesColor[vaccineType],
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
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Vaccines chart</h3>
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

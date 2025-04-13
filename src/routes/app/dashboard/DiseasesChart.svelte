<script lang="ts">
	import {
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		LinearScale,
		TimeScale,
		Tooltip,
		type ChartOptions
	} from 'chart.js';
	import 'chart.js/auto';
	import { onMount } from 'svelte';

	const options: ChartOptions = {
		scales: {
			x: {
				border: {
					display: false
				},
				grid: {
					display: false
				}
			}
		},
		maintainAspectRatio: false
	};

	const data = {
		labels: [
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
		],
		datasets: [
			{
				label: 'Covid',
				data: [12, 19, 3, 5, 2, 3, 10, 12, 19, 3, 5, 2],
				backgroundColor: 'rgba(59, 130, 246, 1)',
				borderColor: 'rgba(59, 130, 246, 1)',
				borderWidth: 1,
				borderRadius: 4,
				borderSkipped: false
			},
			{
				label: 'HIV',
				data: [12, 19, 3, 5, 2, 3, 10, 12, 19, 3, 5, 2],
				backgroundColor: 'rgba(232, 121, 249, 1)',
				borderColor: 'rgba(232, 121, 249, 1)',
				borderWidth: 1,
				borderRadius: 4,
				borderSkipped: false
			},
			{
				label: 'Tuberculosis',
				data: [12, 19, 3, 5, 2, 3, 10, 12, 19, 3, 5, 2],
				backgroundColor: 'rgba(253, 224, 71, 1)',
				borderColor: 'rgba(253, 224, 71, 1)',
				borderWidth: 1,
				borderRadius: 4,
				borderSkipped: false
			}
		]
	};

	let canvasElement: HTMLCanvasElement;
	let chart: Chart;

	Chart.register(Tooltip, BarElement, BarController, CategoryScale, LinearScale, TimeScale);

	onMount(() => {
		chart = new Chart(canvasElement, {
			type: 'bar',
			data: data,
			options: options
		});
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

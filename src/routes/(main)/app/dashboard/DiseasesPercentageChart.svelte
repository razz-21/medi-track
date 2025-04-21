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

	const data = {
		labels: ['Covid', 'HIV', 'Tuberculosis'],
		datasets: [
			{
				data: [12, 19, 3],
				backgroundColor: [
					'rgba(59, 130, 246, 1)',
					'rgba(232, 121, 249, 1)',
					'rgba(253, 224, 71, 1)'
				],
				borderRadius: 8
			}
		]
	};

	let canvasElement: HTMLCanvasElement;
	let chart: Chart;

	Chart.register(Tooltip, BarElement, BarController, CategoryScale, LinearScale, TimeScale);

	onMount(() => {
		chart = new Chart(canvasElement, {
			type: 'doughnut',
			data: data,
			options: options
		});
	});
</script>

<div class="w-full border border-gray-200 rounded-lg p-4">
	<h3 class="text-sm font-bold">Diseases percentage</h3>
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2 text-xs">
				<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
				<span>Covid - <strong>12%</strong></span>
			</div>

			<div class="flex items-center gap-2 text-xs">
				<div class="w-2 h-2 bg-purple-500 rounded-full"></div>
				<span>HIV - <strong>19%</strong></span>
			</div>

			<div class="flex items-center gap-2 text-xs">
				<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
				<span>Tuberculosis - <strong>3%</strong></span>
			</div>
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

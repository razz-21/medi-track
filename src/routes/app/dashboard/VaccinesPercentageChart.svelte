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
		labels: ['Flu', 'Covid', 'Measles', 'Polio', 'Rabbies'],
		datasets: [
			{
				data: [12, 19, 3, 5, 2],
				backgroundColor: [
					'rgba(52, 211, 153, 1)',
					'rgba(59, 130, 246, 1)',
					'rgba(232, 121, 249, 1)',
					'rgba(251, 191, 36, 1)',
					'rgba(248, 113, 113, 1)'
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
	<h3 class="text-sm font-bold">Vaccines percentage</h3>
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded-full"></div>
				<span>Flu - <strong>5%</strong></span>
			</div>

			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-purple-500 rounded-full"></div>
				<span>Measles - <strong>19%</strong></span>
			</div>

			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
				<span>Polio - <strong>3%</strong></span>
			</div>

			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-red-500 rounded-full"></div>
				<span>Rabbies - <strong>2%</strong></span>
			</div>

			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
				<span>Covid - <strong>12%</strong></span>
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

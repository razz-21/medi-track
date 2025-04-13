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
		labels: ['Vaccinated', 'Diseased'],
		datasets: [
			{
				data: [33, 67],
				backgroundColor: ['rgba(52, 211, 153, 1)', 'rgba(248, 113, 113, 1)'],
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
	<h3 class="text-sm font-bold">Vaccines/Diseases percentage</h3>
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
				<span>Vaccinated - <strong>33%</strong></span>
			</div>

			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded-full"></div>
				<span>Diseased - <strong>67%</strong></span>
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

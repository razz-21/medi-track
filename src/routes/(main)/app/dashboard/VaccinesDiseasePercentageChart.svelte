<script lang="ts" module>
	import type { DashboardStatsGet } from '$lib/models/dashboard/dashboard.schema';
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

	type Props = {
		vaccineDiseaseStats: DashboardStatsGet['vaccine_disease_stats'];
	};
</script>

<script lang="ts">
	let { vaccineDiseaseStats }: Props = $props();

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
		return {
			labels: ['Vaccinated', 'Diseased'],
			datasets: [
				{
					data: [vaccineDiseaseStats.vaccinated, vaccineDiseaseStats.diseased],
					backgroundColor: ['rgba(52, 211, 153, 1)', 'rgba(248, 113, 113, 1)'],
					borderRadius: 8
				}
			]
		};
	});

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
	<h3 class="text-sm font-bold">Vaccines/Diseases stats</h3>
	<div class="flex items-center justify-between mt-2">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2 text-xs">
				<div class="w-2 h-2 bg-green-500 rounded-full"></div>
				<span>Vaccinated - <strong>{vaccineDiseaseStats.vaccinated}%</strong></span>
			</div>

			<div class="flex items-center gap-2 text-xs">
				<div class="w-2 h-2 bg-red-500 rounded-full"></div>
				<span>Diseased - <strong>{vaccineDiseaseStats.diseased}%</strong></span>
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

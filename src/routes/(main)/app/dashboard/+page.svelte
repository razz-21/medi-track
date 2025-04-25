<script lang="ts">
	import {
		Calendar as CalendarIcon,
		ClipboardList,
		ClipboardMinus,
		ClipboardPlus,
		UserRoundPlus,
		Users
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Card from './Card.svelte';
	import DiseasesChart from './DiseasesChart.svelte';
	import VaccinesChart from './VaccinesChart.svelte';
	import DiseasesPercentageChart from './DiseasesPercentageChart.svelte';
	import VaccinesPercentageChart from './VaccinesPercentageChart.svelte';
	import DiseasePerBaranggayChart from './DiseasePerBaranggayChart.svelte';
	import VaccinesPerBaranggayChart from './VaccinesPerBaranggayChart.svelte';
	import VaccinesDiseasePercentageChart from './VaccinesDiseasePercentageChart.svelte';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { getDashboardHandler } from '$lib/handler/dashboard/get-dashboard.handler';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { DashboardGetSchema } from '$lib/models/dashboard/dashboard.schema';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let loading = $state(true);
	let dashboard = $state<DashboardGetSchema | null>(null);
	let totalPatients = $derived(dashboard?.totalPatients ?? 0);
	let totalVaccineReports = $derived(dashboard?.totalVaccineReports ?? 0);
	let totalDiseaseReports = $derived(dashboard?.totalDiseaseReports ?? 0);
	let totalReports = $derived(dashboard?.totalReports ?? 0);
	let totalUsers = $derived(dashboard?.totalUsers ?? 0);
	let vaccineDatasets = $derived(dashboard?.vaccine_datasets ?? []);
	let diseaseDatasets = $derived(dashboard?.disease_datasets ?? []);

	let percentageFromDate: DateValue | undefined = undefined;
	let percentageToDate: DateValue | undefined = undefined;

	percentageFromDate = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1);
	percentageToDate = new CalendarDate(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		new Date().getDate()
	);

	let datePeriod = df.format(new Date());

	onMount(async () => {
		loading = true;
		await fetchDashboard();
		loading = false;
	});

	async function fetchDashboard() {
		try {
			const result = await getDashboardHandler();
			dashboard = result;
		} catch (error) {
			toast.error('Failed to fetch dashboard');
			console.error(error);
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-2xl font-bold">Dashboard</h2>
		<div class="text-xs text-gray-500 bg-gray-100 p-2 rounded-2xl flex items-center gap-2">
			<CalendarIcon class="w-4 h-4" />
			<span>Date period: {datePeriod}</span>
		</div>
	</div>

	{#if loading}
		<div class="flex flex-col gap-6">
			<div class="flex gap-4 max-w-[1200px]">
				<Skeleton class="w-full h-20 bg-slate-100 rounded-lg" />
				<Skeleton class="w-full h-20 bg-slate-100 rounded-lg" />
				<Skeleton class="w-full h-20 bg-slate-100 rounded-lg" />
				<Skeleton class="w-full h-20 bg-slate-100 rounded-lg" />
				<Skeleton class="w-full h-20 bg-slate-100 rounded-lg" />
			</div>

			<div class="flex flex-col gap-2 max-w-[1200px]">
				<Skeleton class="w-full h-64 bg-slate-100 rounded-lg" />
				<Skeleton class="w-full h-64 bg-slate-100 rounded-lg" />
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<div class="flex gap-4 max-w-[1200px]">
				<Card title="Total patients" value={totalPatients}>
					{#snippet icon()}
						<UserRoundPlus class="w-4 h-4 text-slate-400" />
					{/snippet}
				</Card>
				<Card title="Total vaccine reports" value={totalVaccineReports}>
					{#snippet icon()}
						<ClipboardPlus class="w-4 h-4 text-slate-400" />
					{/snippet}
				</Card>
				<Card title="Total disease reports" value={totalDiseaseReports}>
					{#snippet icon()}
						<ClipboardMinus class="w-4 h-4 text-slate-400" />
					{/snippet}
				</Card>
				<Card title="Total reports" value={totalReports}>
					{#snippet icon()}
						<ClipboardList class="w-4 h-4 text-slate-400" />
					{/snippet}
				</Card>
				<Card title="Total users" value={totalUsers}>
					{#snippet icon()}
						<Users class="w-4 h-4 text-slate-400" />
					{/snippet}
				</Card>
			</div>

			<VaccinesChart vaccine_datasets={vaccineDatasets} />
			<DiseasesChart disease_datasets={diseaseDatasets} />

			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<Popover.Root>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn(
									'max-w-[240px] w-full justify-start text-left font-normal shadow-none',
									!percentageFromDate && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{percentageFromDate
									? df.format(percentageFromDate.toDate(getLocalTimeZone()))
									: 'From'}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar bind:value={percentageFromDate} />
						</Popover.Content>
					</Popover.Root>
					<span>-</span>
					<Popover.Root>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn(
									'max-w-[240px] w-full justify-start text-left font-normal shadow-none',
									!percentageToDate && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{percentageToDate ? df.format(percentageToDate.toDate(getLocalTimeZone())) : 'To'}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar bind:value={percentageToDate} />
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="flex gap-4">
					<div class="w-1/3">
						<DiseasesPercentageChart />
					</div>
					<div class="w-1/3">
						<VaccinesPercentageChart />
					</div>
					<div class="w-1/3">
						<VaccinesDiseasePercentageChart />
					</div>
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-1/2">
					<DiseasePerBaranggayChart />
				</div>
				<div class="w-1/2">
					<VaccinesPerBaranggayChart />
				</div>
			</div>
		</div>
	{/if}
</div>

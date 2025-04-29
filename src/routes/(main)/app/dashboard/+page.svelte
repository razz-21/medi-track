<script lang="ts">
	import {
		Calendar as CalendarIcon,
		ClipboardList,
		ClipboardMinus,
		ClipboardPlus,
		Loader2,
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
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { getDashboardHandler } from '$lib/handler/dashboard/get-dashboard.handler';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import {
		type DashboardGet,
		type DashboardStatsGet
	} from '$lib/models/dashboard/dashboard.schema';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { getDashboardStatsHandler } from '$lib/handler/dashboard/get-dashboard-stats.handler';
	import { format, startOfYear } from 'date-fns';
	import { Separator } from '$lib/components/ui/separator';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import DropdownMenuCheckboxItem from '$lib/components/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let loading = $state(true);
	let dashboard = $state<DashboardGet | null>(null);
	let totalPatients = $derived(dashboard?.totalPatients ?? 0);
	let totalVaccineReports = $derived(dashboard?.totalVaccineReports ?? 0);
	let totalDiseaseReports = $derived(dashboard?.totalDiseaseReports ?? 0);
	let totalReports = $derived(dashboard?.totalReports ?? 0);
	let totalUsers = $derived(dashboard?.totalUsers ?? 0);
	let vaccineDatasets = $derived(dashboard?.vaccine_datasets ?? []);
	let diseaseDatasets = $derived(dashboard?.disease_datasets ?? []);
	let startingYear = $state(new Date().getFullYear() - 2);
	let year = $state(new Date().getFullYear());
	let yearSelectionList = $derived(Array.from({ length: 5 }, (_, i) => startingYear + i));
	let loadingDashboard = $state(false);

	let dashboardStats = $state<DashboardStatsGet | null>(null);
	let dashboardStatsLoading = $state(true);
	let dashboardStatsVaccine = $derived(dashboardStats?.vaccine_stats ?? []);
	let dashboardStatsDisease = $derived(dashboardStats?.disease_stats ?? []);
	let dashboardStatsVaccineDisease = $derived(
		dashboardStats?.vaccine_disease_stats ?? { vaccinated: 0, diseased: 0 }
	);
	let dashboardStatsVaccineBrgy = $derived(dashboardStats?.vaccined_brgy_stats ?? []);
	let dashboardStatsDiseaseBrgy = $derived(dashboardStats?.diseased_brgy_stats ?? []);

	let percentageFromDate: DateValue = $state(
		parseDate(format(startOfYear(new Date()), 'yyyy-MM-dd'))
	);
	let percentageToDate: DateValue = $state(parseDate(format(new Date(), 'yyyy-MM-dd')));
	let today = $state(parseDate(format(new Date(), 'yyyy-MM-dd')));

	let datePeriod = df.format(new Date());

	onMount(async () => {
		loading = true;
		await fetchDashboard();
		await fetchDashboardStats();
		loading = false;
	});

	async function fetchDashboard() {
		try {
			const result = await getDashboardHandler({
				year: year.toString()
			});

			dashboard = result;
		} catch (error) {
			toast.error('Failed to fetch dashboard');
			console.error(error);
		}
	}

	async function fetchDashboardStats() {
		dashboardStatsLoading = true;
		try {
			const result = await getDashboardStatsHandler({
				from: format(new Date(percentageFromDate.toString()), 'yyyy-MM-dd'),
				to: format(new Date(percentageToDate.toString()), 'yyyy-MM-dd')
			});
			dashboardStats = result;
		} catch (error) {
			toast.error('Failed to fetch dashboard stats');
			console.error(error);
		} finally {
			dashboardStatsLoading = false;
		}
	}

	function handleDatedFromChange(date: DateValue | undefined) {
		if (!date) return;
		percentageFromDate = date;
		fetchDashboardStats();
	}

	function handleDatedToChange(date: DateValue | undefined) {
		if (!date) return;
		percentageToDate = date;
		fetchDashboardStats();
	}

	async function handleYearChange(yearSelection: number) {
		loadingDashboard = true;
		year = yearSelection;
		await fetchDashboard();
		loadingDashboard = false;
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

			<div class="flex flex-col gap-4 max-w-[1440px]">
				<div class="flex">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div
								class="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg py-1 px-2 hover:bg-slate-100 cursor-pointer"
							>
								<CalendarIcon class="w-4 h-4" />
								<span class="text-xs">Year</span>
								{#if year}
									<Separator orientation="vertical" class="h-6" />
									<div class="bg-slate-100 rounded-lg p-1 px-2 text-xs">{year}</div>
								{/if}
								{#if loadingDashboard}
									<Loader2 class="w-4 h-4 text-slate-500 animate-spin" />
								{/if}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{#each yearSelectionList as selectionYear}
								<DropdownMenuCheckboxItem
									checked={year === selectionYear}
									onCheckedChange={() => handleYearChange(selectionYear)}
									>{selectionYear}</DropdownMenuCheckboxItem
								>
							{/each}
						</DropdownMenuContent>
					</DropdownMenu>
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
									disabled={dashboardStatsLoading}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{percentageFromDate
										? df.format(percentageFromDate.toDate(getLocalTimeZone()))
										: 'From'}
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" align="start">
								<Calendar
									bind:value={percentageFromDate}
									onValueChange={(value) => handleDatedFromChange(value)}
								/>
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
									disabled={dashboardStatsLoading}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{percentageToDate ? df.format(percentageToDate.toDate(getLocalTimeZone())) : 'To'}
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" align="start">
								<Calendar
									bind:value={percentageToDate}
									minValue={percentageFromDate}
									maxValue={today}
									onValueChange={(value) => handleDatedToChange(value)}
								/>
							</Popover.Content>
						</Popover.Root>
						{#if dashboardStatsLoading}
							<Loader2 class="w-6 h-6 text-green-500 animate-spin" />
						{/if}
					</div>
					<div class="flex gap-4">
						<div class="w-1/3">
							<DiseasesPercentageChart dashboardStats={dashboardStatsDisease} />
						</div>
						<div class="w-1/3">
							<VaccinesPercentageChart vaccineStats={dashboardStatsVaccine} />
						</div>
						<div class="w-1/3">
							<VaccinesDiseasePercentageChart vaccineDiseaseStats={dashboardStatsVaccineDisease} />
						</div>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="w-1/2">
						<DiseasePerBaranggayChart diseasedBrgyStats={dashboardStatsDiseaseBrgy} />
					</div>
					<div class="w-1/2">
						<VaccinesPerBaranggayChart vaccinedBrgyStats={dashboardStatsVaccineBrgy} />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

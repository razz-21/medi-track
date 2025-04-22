<script lang="ts">
	import { Calendar as CalendarIcon, UserRoundPlus } from '@lucide/svelte';
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

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let percentageFromDate: DateValue | undefined = undefined;
	let percentageToDate: DateValue | undefined = undefined;

	percentageFromDate = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, 1);
	percentageToDate = new CalendarDate(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		new Date().getDate()
	);

	let datePeriod = df.format(new Date());
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-2xl font-bold">Dashboard</h2>
		<div class="text-xs text-gray-500 bg-gray-100 p-2 rounded-2xl flex items-center gap-2">
			<CalendarIcon class="w-4 h-4" />
			<span>Date period: {datePeriod}</span>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex gap-4 max-w-[1200px]">
			<Card title="Total patients" value="54,000">
				{#snippet icon()}
					<UserRoundPlus class="w-4 h-4" color="gray" />
				{/snippet}
			</Card>
			<Card title="Total diagnosis" value="1,233">
				{#snippet icon()}
					<UserRoundPlus class="w-4 h-4" color="gray" />
				{/snippet}
			</Card>
			<Card title="Total diseases" value="120">
				{#snippet icon()}
					<UserRoundPlus class="w-4 h-4" color="gray" />
				{/snippet}
			</Card>
			<Card title="Total reports" value="1,009">
				{#snippet icon()}
					<UserRoundPlus class="w-4 h-4" color="gray" />
				{/snippet}
			</Card>
			<Card title="Total patients" value="10,000">
				{#snippet icon()}
					<UserRoundPlus class="w-4 h-4" color="gray" />
				{/snippet}
			</Card>
		</div>

		<DiseasesChart />
		<VaccinesChart />

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
</div>

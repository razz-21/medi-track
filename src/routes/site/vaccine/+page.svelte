<script lang="ts" module>
	import { MoveDown } from '@lucide/svelte';
	import SiteNavigationBar from '../SiteNavigationBar.svelte';
	import { VaccineTypeEnum } from '$lib/models/vaccine/vaccine.type';
	import type { VaccineSite } from '$lib/models/vaccine/vaccine.schema';
	import { toast } from 'svelte-sonner';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	type Props = {
		data: {
			stats: VaccineSite;
		};
	};
</script>

<script lang="ts">
	let { data }: Props = $props();

	let stats = $derived(data.stats);

	beforeNavigate(() => {
		toast.info('Redirecting to site. Please wait...');
	});

	afterNavigate(() => {
		toast.dismiss();
	});

	function handleExplore() {
		const casesStatsSection = document.querySelector('.cases-stats');
		if (casesStatsSection) {
			casesStatsSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleExplore();
		}
	}
</script>

<div class="flex flex-col h-screen">
	<SiteNavigationBar />
	<div
		class="h-[60rem] sm:h-[50rem] w-full bg-gradient-to-b from-white from-50% to-green-300 rounded-b-3xl"
	>
		<div
			class="flex items-center justify-center flex-col sm:flex-row gap-10 h-full max-w-[1200px] mx-auto px-6 py-4"
		>
			<div class="w-full sm:w-1/2 flex flex-col mb-[8rem]">
				<div class="text-[42px] font-bold italic text-green-900">Welcome to Meditrack</div>
				<div class="text-[24px] font-light">A Health Vaccine Dashboard</div>
				<div class="text-[16px] font-light mt-4">
					Access a vaccine dashboard and track the vaccine progress through our intuitive dashboard.
					View the total number of cases, current status, and related information all in one place.
				</div>

				<div
					role="button"
					tabindex="0"
					class="bg-green-400 items-center flex gap-2 py-2 px-4 rounded-full mt-6 w-fit cursor-pointer font-medium"
					onclick={handleExplore}
					onkeydown={handleKeyDown}
				>
					<MoveDown class="size-4" />
					<span>Explore</span>
				</div>
			</div>

			<div class="relative w-full sm:w-1/2 flex flex-col items-end">
				<div class="absolute bottom-[-17rem] sm:bottom-[-25rem] right-0">
					<img
						src="/images/doctor_female.png"
						alt="Disease Dashboard"
						class="w-full h-full max-w-[20rem] max-h-[30rem] sm:max-w-[30rem] sm:max-h-[42rem] object-cover"
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block cases-stats">
		<div class="text-3xl font-bold text-green-900 text-center">Cases Stats</div>

		<div class="grid grid-cols-3 sm:grid-cols-6 gap-6">
			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">BCG</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.BCG)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">HepaB1</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.HepaB1)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Influenza</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.Polio)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">PCV</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.PCV)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">MMR</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.MMR)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">COVID-19</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === VaccineTypeEnum.Covid19)?.count}
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">BCG</div>
					<div class="text-sm font-light">
						BCG (Bacille Calmette-Guérin) is a vaccine primarily used against tuberculosis. It is
						typically administered shortly after birth and provides protection against severe forms
						of tuberculosis in children.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.BCG].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.BCG].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.BCG].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.BCG].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="flex flex-col sm:flex-row-reverse gap-10">
			<div class="w-full sm:w-1/2">
				<div class="text-[46px] font-bold">HepaB1</div>
				<div class="text-sm font-light">
					Hepatitis B vaccine (HepaB1) is given to protect against hepatitis B virus infection. The
					first dose is recommended within 24 hours of birth, followed by additional doses to ensure
					long-term protection against liver disease.
				</div>
			</div>

			<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total Cases</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.HepaB1].total_cases}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this year</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.HepaB1].total_cases_year}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this month</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.HepaB1].total_cases_month}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this week</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.HepaB1].total_cases_week}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">Polio</div>
					<div class="text-sm font-light">
						Polio vaccine protects against poliomyelitis, a highly infectious viral disease that can
						cause paralysis. The vaccine is given in multiple doses during infancy and childhood to
						ensure complete protection.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.Polio].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.Polio].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.Polio].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.Polio].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="flex flex-col sm:flex-row-reverse gap-10">
			<div class="w-full sm:w-1/2">
				<div class="text-[46px] font-bold">PCV</div>
				<div class="text-sm font-light">
					PCV (Pneumococcal Conjugate Vaccine) protects against infections caused by Streptococcus
					pneumoniae bacteria, including pneumonia, meningitis, and bloodstream infections. It is
					particularly important for young children and older adults.
				</div>
			</div>

			<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total Cases</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.PCV].total_cases}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this year</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.PCV].total_cases_year}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this month</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.PCV].total_cases_month}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this week</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.PCV].total_cases_week}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">MMR</div>
					<div class="text-sm font-light">
						MMR (Measles, Mumps, and Rubella) vaccine provides protection against three serious
						viral diseases. It is typically given in two doses during childhood and provides
						long-lasting immunity against these highly contagious diseases.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.MMR].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.MMR].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.MMR].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[VaccineTypeEnum.MMR].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="flex flex-col sm:flex-row-reverse gap-10">
			<div class="w-full sm:w-1/2">
				<div class="text-[46px] font-bold">COVID-19</div>
				<div class="text-sm font-light">
					COVID-19 vaccines protect against the SARS-CoV-2 virus that causes COVID-19. These
					vaccines help prevent severe illness, hospitalization, and death from COVID-19 infection.
				</div>
			</div>

			<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total Cases</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.Covid19].total_cases}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this year</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.Covid19].total_cases_year}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this month</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.Covid19].total_cases_month}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this week</div>
					<div class="text-4xl font-bold">{stats[VaccineTypeEnum.Covid19].total_cases_week}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="text-center text-3xl font-bold text-green-900">Go visit the disease site</div>
		<a
			href="/site/disease"
			class="rounded-full bg-green-300 w-fit mx-auto p-2 px-4 font-bold cursor-pointer"
		>
			<span>Disease site</span>
		</a>
	</div>

	<div class="bg-green-400">
		<div class="section-block w-full">
			<div class="text-white text-3xl font-bold text-center">
				<span>Thank you for visiting the Meditrack</span>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference 'tailwindcss';

	.section-block {
		@apply flex flex-col gap-6 py-22 px-6 sm:px-4 max-w-[1200px] w-full mx-auto;
	}
</style>

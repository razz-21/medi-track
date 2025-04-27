<script lang="ts" module>
	import { MoveDown } from '@lucide/svelte';
	import SiteNavigationBar from '../SiteNavigationBar.svelte';
	import type { DiseaseSite } from '$lib/models/disease/disease.schema';
	import { DiseaseTypeEnum } from '$lib/models/disease/disease.type';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	type Props = {
		data: {
			stats: DiseaseSite;
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
				<div class="text-[24px] font-light">A Health Disease Dashboard</div>
				<div class="text-[16px] font-light mt-4">
					Access a disease dashboard and track the disease progress through our intuitive dashboard.
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

		<div class="grid grid-cols-3 sm:grid-cols-5 gap-6">
			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Covid19</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === DiseaseTypeEnum.Covid19)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Dengue</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === DiseaseTypeEnum.Dengue)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Influenza</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === DiseaseTypeEnum.Influenza)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">TB</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === DiseaseTypeEnum.TB)?.count}
				</div>
			</div>

			<div class="px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">HIV</div>
				<div class="text-4xl font-bold">
					{stats.cases_stats.find((c) => c.type === DiseaseTypeEnum.HIV)?.count}
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">Covid19</div>
					<div class="text-sm font-light">
						Covid19 is a highly contagious respiratory illness caused by the SARS-CoV-2 virus. It
						can cause mild to severe illness, and at times can lead to death. Symptoms include
						fever, cough, sore throat, runny or stuffy nose, body aches, headache, chills, and
						fatigue. The virus spreads mainly through respiratory droplets when infected people
						cough, sneeze, or talk. The best way to prevent flu is by getting a flu vaccine each
						year.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Covid19].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Covid19].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Covid19].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Covid19].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="flex flex-col sm:flex-row-reverse gap-10">
			<div class="w-full sm:w-1/2">
				<div class="text-[46px] font-bold">Dengue</div>
				<div class="text-sm font-light">
					Dengue fever is a mosquito-borne viral infection that causes a severe flu-like illness. It
					is transmitted by the Aedes aegypti mosquito and occasionally by Aedes albopictus.
					Symptoms typically begin 4-10 days after infection and include high fever, severe
					headache, pain behind the eyes, muscle and joint pains, nausea, vomiting, swollen glands,
					and rash. In severe cases, it can develop into dengue hemorrhagic fever or dengue shock
					syndrome, which can be life-threatening. There is no specific treatment for dengue, but
					early detection and proper medical care can significantly reduce mortality rates.
				</div>
			</div>

			<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total Cases</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.Dengue].total_cases}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this year</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.Dengue].total_cases_year}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this month</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.Dengue].total_cases_month}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this week</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.Dengue].total_cases_week}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">Influenza</div>
					<div class="text-sm font-light">
						Influenza, commonly known as the flu, is a highly contagious respiratory illness caused
						by influenza viruses. It affects the nose, throat, and sometimes the lungs. The virus
						spreads through respiratory droplets when infected people cough, sneeze, or talk.
						Symptoms typically appear 1-4 days after exposure and include sudden onset of fever,
						chills, muscle aches, cough, congestion, runny nose, headaches, and fatigue. While most
						people recover within a week, influenza can lead to severe complications like pneumonia,
						bronchitis, and even death, particularly in high-risk groups such as young children,
						elderly, pregnant women, and those with chronic medical conditions. Annual vaccination
						is the most effective way to prevent influenza infection.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Influenza].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Influenza].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Influenza].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.Influenza].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="flex flex-col sm:flex-row-reverse gap-10">
			<div class="w-full sm:w-1/2">
				<div class="text-[46px] font-bold">TB (Tuberculosis)</div>
				<div class="text-sm font-light">
					TB is a bacterial infection that affects the lungs. It is transmitted through the air when
					an infected person coughs or sneezes. Symptoms include a persistent cough, fever, night
					sweats, and weight loss. TB is curable with antibiotics, but can be life-threatening if
					left untreated.
				</div>
			</div>

			<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total Cases</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.TB].total_cases}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this year</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.TB].total_cases_year}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this month</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.TB].total_cases_month}</div>
				</div>

				<div class="bg-green-200 rounded-lg shadow-lg p-4">
					<div class="text-sm font-bold">Total cases this week</div>
					<div class="text-4xl font-bold">{stats[DiseaseTypeEnum.TB].total_cases_week}</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-green-300">
		<div class="section-block">
			<div class="flex flex-col sm:flex-row gap-10">
				<div class="w-full sm:w-1/2">
					<div class="text-[46px] font-bold">HIV</div>
					<div class="text-sm font-light">
						HIV is a virus that affects the immune system. It is transmitted through sexual contact,
						blood transfusions, and from mother to child during pregnancy, childbirth, and
						breastfeeding. Symptoms include a weakened immune system, weight loss, and fatigue. HIV
						is curable with antiretroviral therapy, but can be life-threatening if left untreated.
					</div>
				</div>

				<div class="w-full sm:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total Cases</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.HIV].total_cases}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this year</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.HIV].total_cases_year}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this month</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.HIV].total_cases_month}
						</div>
					</div>

					<div class="bg-white rounded-lg shadow-lg p-4">
						<div class="text-sm font-bold">Total cases this week</div>
						<div class="text-4xl font-bold text-green-700">
							{stats[DiseaseTypeEnum.HIV].total_cases_week}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="section-block">
		<div class="text-center text-3xl font-bold text-green-900">Go visit the vaccine site</div>
		<a
			href="/site/vaccine"
			class="rounded-full bg-green-300 w-fit mx-auto p-2 px-4 font-bold cursor-pointer"
		>
			<span>Vaccine site</span>
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

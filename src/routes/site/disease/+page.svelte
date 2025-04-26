<script lang="ts">
	import { MoveDown } from '@lucide/svelte';
	import SiteNavigationBar from '../SiteNavigationBar.svelte';
</script>

<div class="flex flex-col h-screen">
	<SiteNavigationBar />
	<div
		class="max-h-[50rem] h-full w-full bg-gradient-to-b from-white from-50% to-green-300 rounded-b-3xl"
	>
		<div class="flex items-center justify-center gap-10 h-full max-w-[1200px] mx-auto px-6 py-4">
			<div class="w-1/2 flex flex-col mb-[8rem]">
				<div class="text-[42px] font-bold italic text-green-900">Welcome to Meditrack</div>
				<div class="text-[24px] font-light">A Health Disease Dashboard</div>
				<div class="text-[16px] font-light mt-4">
					Access a disease dashboard and track the disease progress through our intuitive dashboard.
					View the total number of cases, current status, and related information all in one place.
				</div>

				<div
					class="bg-green-400 items-center flex gap-2 py-2 px-4 rounded-full mt-6 w-fit cursor-pointer font-medium"
				>
					<MoveDown class="size-4" />
					<span>Explore</span>
				</div>
			</div>

			<div class="relative w-1/2 flex flex-col items-end">
				<div class="absolute bottom-[-22rem] right-0">
					<img
						src="/images/doctor_female.png"
						alt="Disease Dashboard"
						class="w-full h-full max-w-[30rem] max-h-[42rem] object-cover"
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-6 py-22 max-w-[1200px] w-full mx-auto">
		<div class="text-3xl font-bold text-green-900 text-center">Cases Stats</div>

		<div class="flex gap-6">
			<div class="w-2/10 px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Flu</div>
				<div class="text-4xl font-bold">100</div>
			</div>

			<div class="w-2/10 px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Dengue</div>
				<div class="text-4xl font-bold">100</div>
			</div>

			<div class="w-2/10 px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">Influenza</div>
				<div class="text-4xl font-bold">100</div>
			</div>

			<div class="w-2/10 px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">TB</div>
				<div class="text-4xl font-bold">100</div>
			</div>

			<div class="w-2/10 px-4 py-4 shadow-lg bg-white rounded-lg">
				<div class="text-sm font-bold text-gray-500">HIV</div>
				<div class="text-4xl font-bold">100</div>
			</div>
		</div>
	</div>
</div>

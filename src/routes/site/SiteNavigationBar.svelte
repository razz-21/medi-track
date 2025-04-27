<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Routes } from '$lib/models/navigation/routes';
	import { Route } from '@lucide/svelte';

	let activeRoute = $derived(page.url.pathname);

	function handleGoto(route: Routes) {
		goto(route);
	}

	function handleKeyDown(event: KeyboardEvent, route: Routes) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleGoto(route);
		}
	}
</script>

<div class="fixed top-0 left-0 ] w-screen z-10 bg-white">
	<div class="max-w-[1200px] mx-auto">
		<div class="flex items-center justify-between py-2 px-4">
			<div class="flex items-center gap-3">
				<img src="/logo/meditrack-logo.svg" alt="Meditrack" class="size-10 mx-auto" />
				<div class="text-green-700 font-bold">Meditrack</div>
			</div>

			<div class="flex items-center gap-2">
				<div
					role="button"
					tabindex="0"
					class="p-2 rounded-xl text-xs font-medium cursor-pointer {activeRoute ===
					Routes.SiteDisease
						? 'bg-green-300 '
						: ''}"
					onclick={() => handleGoto(Routes.SiteDisease)}
					onkeydown={(event) => handleKeyDown(event, Routes.SiteDisease)}
				>
					Disease site
				</div>
				<div
					role="button"
					tabindex="0"
					class="p-2 rounded-xl text-xs font-medium cursor-pointer {activeRoute ===
					Routes.SiteVaccine
						? 'bg-green-300 '
						: ''}"
					onclick={() => handleGoto(Routes.SiteVaccine)}
					onkeydown={(event) => handleKeyDown(event, Routes.SiteVaccine)}
				>
					Vaccine site
				</div>
			</div>
		</div>
	</div>
</div>
